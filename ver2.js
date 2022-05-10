//? to consider:
// adding "blocks"/"walls" to avoid inside arena once past a certain score
// cannot hit own tail
// choose speed difficulty at the start

const data = {
    arena: {
        boxes: 22,
    },
    snake: [
            {row: 1, cell: 4},
            {row: 1, cell: 3},
            {row: 1, cell: 2},
            {row: 1, cell: 1}
    ],
    direction: "right",
    foodCount: 0,
    food: {
        row: null,
        cell: null,
    },
    speed: null
}

let gameOn;

$(document).on("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Down") { 
        if (data.direction === "up") {
            return;
        } else {
            data.direction = "down";
        }
    } else if (event.key === "ArrowUp" || event.key === "Up") {
        if (data.direction === "down") {
            return;
        } else {
            data.direction = "up";
        }
    } else if (event.key === "ArrowLeft" || event.key === "Left") {
        if (data.direction === "right") {
            return;
        } else {
            data.direction = "left"
        }
    } else if (event.key === "ArrowRight" || event.key === "Right") {
        if (data.direction === "left") {
            return;
        } else {
            data.direction = "right"
        }
    }
})


const endGame = () => {
    $(".table").remove()
    $(".points").remove()
    endingPage();
}

const endingPage = () => {
    const $end = $("<div>").addClass("end");
    const $lose = $("<div>").attr("id", "lose").text("GAME OVER")
    const $again = $("<div>").attr("id", "again").text("Replay")
    const $score = $("<div>").attr("id", "score").text(`You fed the snake ${data.foodCount} times`)
    const $returnHome = $("<div>").attr("id", "returnHome").text("Click to re-select difficulty")
    $lose.append($score, $again, $returnHome)
    $end.append($lose)
    $(".container").append($end)

    $again.on("click", () => {
        // $(".container").empty()
        $(".end").remove();
        data.snake = [
            {row: 1, cell: 4},
            {row: 1, cell: 3},
            {row: 1, cell: 2},
            {row: 1, cell: 1}
        ];
        data.direction = "right";
        data.foodCount = 0;
        initGame(data.speed);
    })

    $returnHome.on("click", () => {
        location.reload()
    })
}

const checkOutOfBoundary = () => {
    const rightWallCell = data.arena.boxes - 1;
    const leftWallCell = 0;
    const topWallRow = 0;
    const bottomWallRow = data.arena.boxes - 1;
    if (data.snake[0].cell > rightWallCell
        || data.snake[0].cell < leftWallCell
        || data.snake[0].row < topWallRow
        || data.snake[0].row > bottomWallRow) {

        clearInterval(gameOn)
        endGame(); 
    } else {
        return false;
    }
}   

const updatePoints = () => {
    $(".points").text(`SCORE: ${data.foodCount}`);
}

const checkFood = () => {
    if (data.snake[0].row === data.food.row && data.snake[0].cell === data.food.cell) {
        $(".food").removeClass("food").css("background-color","").css("border-color", "");
        data.foodCount++;
        updatePoints();
        makeFood();
        return true;
    } else {
        return false;
    }
}

const updateSnake = () => {
    //check food
    if (!checkFood()) {
        data.snake.pop()
    } 
    
    if (data.direction === "right") {
        data.snake.unshift({row: data.snake[0].row, cell: data.snake[0].cell + 1});
        
    } else if (data.direction === "down") {
        data.snake.unshift({row: data.snake[0].row + 1, cell: data.snake[0].cell});
        
    } else if (data.direction === "up") {
        data.snake.unshift({row: data.snake[0].row - 1, cell: data.snake[0].cell});
        
    } else if (data.direction === "left") {
        data.snake.unshift({row: data.snake[0].row, cell: data.snake[0].cell - 1});
        
    }
    
}

const checkHitOwnTail = () => {
    if ($(".snakeHead").hasClass("snakeBody")) {
        clearInterval(gameOn)
        endGame(); 
    } 
}

const showSnake = () => {
        updateSnake();
        checkOutOfBoundary();
        // clear snake
        $("td").removeClass("snakeBody").removeClass("snakeHead");
        // print snake
        for (let i = 0; i < data.snake.length; i++) {
            const $snakeID = $(`#row${data.snake[i].row}cell${data.snake[i].cell}`);
            if (i === 0) {
                $snakeID.addClass("snakeHead");
            } else {
                $snakeID.addClass("snakeBody")
            }
        }
       
        checkHitOwnTail();
}

const makeFood = () => {
    const row = Math.floor(Math.random() * data.arena.boxes);
    const cell = Math.floor(Math.random() * data.arena.boxes);

    const $foodCell = $(`#row${row}cell${cell}`)
    if ($foodCell.hasClass("snakeBody") || $foodCell.hasClass("snakeHead")) {
        return makeFood();
    } else {
        $foodCell.addClass("food");
        data.food.row = row;
        data.food.cell = cell;

        const red = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        $(".food").css("background-color", `rgb(${red}, ${green}, ${blue})`).css("border-color", "white");
    }
}


// const makeFood = () => {
    
//     data.food.row = Math.floor(Math.random() * data.arena.boxes);
//     data.food.cell = Math.floor(Math.random() * data.arena.boxes);
    
//     for (let i = 0; i < data.snake.length; i++) {
//         if (data.snake[i].row === data.food.row && data.snake[i].cell === data.food.cell) {
//             makeFood();
//         } else {
//             const $foodID = $(`#row${data.food.row}cell${data.food.cell}`)
//             $foodID.addClass("food");
//         }
//     }
// }


const makeTable = () => {
    const $div = $("<div>").addClass("table")
    const $table = $("<table>").addClass("arena")
    for (let i = 0; i < data.arena.boxes; i++) {
        const $tr = $("<tr>").attr("id", `row${i}`)

        for (let j = 0; j < data.arena.boxes; j++) {
            const $td = $("<td>").attr("id", `row${i}cell${j}`);
            $tr.append($td)
        }
        $table.append($tr)
    }
    $div.append($table)
    $(".container").append($div)
}

const makePoints = () => {
    const $div = $("<div>").addClass("points").text(`SCORE: ${data.foodCount}`);
    $(".container").append($div);
}

const initGame = (speed) => {
    makePoints();
    makeTable();
    showSnake();
    makeFood();
    
    gameOn = setInterval(showSnake, speed);   
}

const handleStartEasy = () => {
    $("#rules").hide();
    data.speed = 250;
    initGame(250);
}

const handleStartMedium = () => {
    $("#rules").hide();
    data.speed = 175;
    initGame(175);
}
const handleStartHard = () => {
    $("#rules").hide();
    data.speed = 75;
    initGame(75);
}

const startingPage = () => {
    
    // const $startButton = $("<div>").addClass("startButton").text("START").on("click", handleStart)
    const $speedOption = $("<div>").addClass("speedOption").text("Choose a difficulty level to start:")
    const $easy = $("<div>").addClass("easyButton").text("EASY").on("click", handleStartEasy)
    const $medium = $("<div>").addClass("mediumButton").text("MEDIUM").on("click", handleStartMedium)
    const $hard = $("<div>").addClass("hardButton").text("HARD").on("click", handleStartHard)

    $speedOption.append($easy, $medium, $hard)

    const $rules = $("<div>").attr("id", "rules")
    $rules.text("Welcome to Hungry Snake")
    const $p =  $("<p>").attr("id", "innerRules").text("Use your arrow keys to guide the snake to its food, avoid the walls and do not eat your own tail!")
    
    

    $rules.append($p, $speedOption)
    $(".container").append($rules);
};

const main = () => {
   startingPage();
}

$(main);