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
    speed: null,
    displaySpeed: "",
}

let gameOn;

const endGame = () => {
    $(".table").remove()
    $(".points").remove()
    endingPage();
}

const endingPage = () => {
    const $end = $("<div>").addClass("end");
    const $lose = $("<div>").attr("id", "lose").text("GAME OVER")
    const $again = $("<div>").attr("id", "again").text("Replay")
    const $score = $("<div>").attr("id", "score").text(`You fed the snake ${data.foodCount} times in ${data.displaySpeed} mode`)
    const $returnHome = $("<div>").attr("id", "returnHome").text("Click to re-select difficulty")
    $lose.append($score, $again, $returnHome)
    $end.append($lose)
    $(".container").append($end)

    // to display personal highscore for current speed mode
    const $scoreBoard = $("<div>").text(`Your ${data.displaySpeed} mode personal highscore:`).addClass("scoreBoard")
    const highestScore = checkHighScore(data.displaySpeed);
    const $highScore = $("<div>").text(highestScore);
    $scoreBoard.append($highScore);
    $lose.append($scoreBoard)

    // to replay in the same speed mode
    $again.on("click", () => {
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
    // to refresh page & re-select speed
    $returnHome.on("click", () => {
        location.reload()
    })
}

// to check and update localStorage of highscores for current speed mode
const checkHighScore = (speed) => {
    let previousScores = window.localStorage.getItem(`${speed}`)
    const updatedScores = [data.foodCount];
    if (previousScores !== null) {
        updatedScores.push(previousScores);
        updatedScores.sort((a,b) => {
            return b-a;
        })
    }
    const highest = updatedScores[0]
    window.localStorage.setItem(`${speed}`, highest);
    return highest;
}

// to check if snake went out of game boundary
// if yes, clear interval and end game
const checkOutOfBoundary = () => {
    const rightWallCell = data.arena.boxes - 1;
    const leftWallCell = 0;
    const topWallRow = 0;
    const bottomWallRow = data.arena.boxes -1;
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

// to check if snake hits own tail
// if yes, clear interval and end game
const checkHitOwnTail = () => {
    if ($(".snakeHead").hasClass("snakeBody")) {
        clearInterval(gameOn)
        endGame(); 
    } 
}

// to generate random food box
// if food box coincides with snake body, regenerate the food box
const makeFood = () => {
    const row = Math.floor(Math.random() * data.arena.boxes);
    const cell = Math.floor(Math.random() * data.arena.boxes);

    while ($(`#row${row}cell${cell}`).hasClass("snakeBody") || $(`#row${row}cell${cell}`).hasClass("snakeHead")) {
        row = Math.floor(Math.random() * data.arena.boxes);
        cell = Math.floor(Math.random() * data.arena.boxes);
    }    
    const $foodCell = $(`#row${row}cell${cell}`)
    
    $foodCell.addClass("food");
    data.food.row = row;
    data.food.cell = cell;
    // random RGB color for food box
    const red = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    $(".food").css("background-color", `rgb(${red}, ${green}, ${blue})`).css("border-color", "white");
}

// to check if snake ate the food
const checkFood = () => {
    if (data.snake[0].row === data.food.row && data.snake[0].cell === data.food.cell) {
        // to clear CSS from the current food box
        $(".food").removeClass("food").css("background-color","").css("border-color", "");
        data.foodCount++;
        updatePoints();
        makeFood();
        return true;
    } else {
        return false;
    }
}

// update score on screen
const updatePoints = () => {
    $(".points").text(`SCORE: ${data.foodCount}`);
}

// keydown events for arrow keys and WASD
$(document).on("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Down" || event.key === "s" || event.key === "S") { 
        if (data.direction === "up") {
            return;
        } else {
            data.direction = "down";
        }
    } else if (event.key === "ArrowUp" || event.key === "Up" || event.key === "w" || event.key === "W") {
        if (data.direction === "down") {
            return;
        } else {
            data.direction = "up";
        }
    } else if (event.key === "ArrowLeft" || event.key === "Left" || event.key === "a" || event.key === "A") {
        if (data.direction === "right") {
            return;
        } else {
            data.direction = "left"
        }
    } else if (event.key === "ArrowRight" || event.key === "Right" || event.key === "d" || event.key === "D") {
        if (data.direction === "left") {
            return;
        } else {
            data.direction = "right"
        }
    }
})

// update snake body array
const updateSnake = () => {
    // check food
    // if snake did not eat food, pop the tail. 
    // Else, don't pop the tail (tail extends if food eaten)
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

// displays snake on screen
const showSnake = () => {
    updateSnake();
    checkOutOfBoundary();
    // clear previous snake from screen
    $(".snakeBody").removeClass("snakeBody")
    $(".snakeHead").removeClass("snakeHead");
    // print snake based on updated snake body array
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

const initGame = (speed) => {
    makePoints();
    makeTable();
    
    // stores set Interval as a global variable so that we can stopInterval to end the game later
    gameOn = setInterval(showSnake, speed);   
    makeFood();
}

// create game play area for the snake
const makeTable = () => {
    const $table = $("<div>").addClass("table")
    const $arena = $("<div>").addClass("arena")
    for (let i = 0; i < data.arena.boxes; i++) {

        for (let j = 0; j < data.arena.boxes; j++) {
            const $td = $("<div>").attr("id", `row${i}cell${j}`);
            const gr = i + 1;
            const gc = j + 1
            $td.css("grid-row", `${gr}`);
            $td.css("grid-column", `${gc}`)
            $td.addClass("cell")
            $arena.append($td)
        }
    
    }
    $table.append($arena)
    $(".container").append($table)
}

// display points on screen
const makePoints = () => {
    const $div = $("<div>").addClass("points").text(`SCORE: ${data.foodCount}`);
    $(".container").append($div);
}

// easy mode chosen
const handleStartEasy = () => {
    $("#rules").remove();
    data.speed = 150;
    data.displaySpeed = "easy";
    initGame(data.speed);
}

// medium mode chosen
const handleStartMedium = () => {
    $("#rules").remove();
    data.speed = 100;
    data.displaySpeed = "medium";
    initGame(data.speed);
}

// hard mode chosen
const handleStartHard = () => {
    $("#rules").remove();
    data.speed = 50;
    data.displaySpeed = "hard";
    initGame(data.speed);
}

const startingPage = () => {
    // create mode choice buttons using divs
    const $speedOption = $("<div>").addClass("speedOption").text("Choose a difficulty level to start:")
    const $easy = $("<div>").addClass("easyButton").text("EASY").on("click", handleStartEasy)
    const $medium = $("<div>").addClass("mediumButton").text("MEDIUM").on("click", handleStartMedium)
    const $hard = $("<div>").addClass("hardButton").text("HARD").on("click", handleStartHard)
    $speedOption.append($easy, $medium, $hard)
    // create intro to game
    const $rules = $("<div>").attr("id", "rules")
    $rules.text("Welcome to Hungry Snake")
    const $p =  $("<p>").attr("id", "innerRules").text("Use your arrow keys to guide the snake to its food, avoid the walls and do not eat your own tail!")
    $rules.append($p, $speedOption)
    $(".container").append($rules);
    // create controls guide
    const $controls = $("<div>").addClass("controls").text("Controls:")
    const $up = $("<div>").attr("id", "up").text("W or ⥣")
    const $down = $("<div>").attr("id", "down").text("S or ⥥")
    const $right = $("<div>").attr("id", "right").text("D or ⥤")
    const $left = $("<div>").attr("id", "left").text("A or ⥢")
    
    $controls.append($up, $down, $left, $right)
    $($rules).append($controls)
};

const main = () => {
    startingPage();
 }
 
 $(main);


