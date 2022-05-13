const data = {
    arena: {
        boxes: 22,
    },
    snake: [
            {row: 1, cell: 3},
            {row: 1, cell: 2},
            {row: 1, cell: 1},
            {row: 1, cell: 0}
    ],
    direction: "right",
    foodCount: 0,
    food: {
        row: null,
        cell: null,
    },
    bomb: [
        //west bomb
        {row: null, cell: null},
        //east bomb
        {row: null, cell: null},
        //north bomb
        {row: null, cell: null},
        //south bomb
        {row: null, cell: null},
        //middle bomb
        {row: null, cell: null}
],
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
            {row: 1, cell: 3},
            {row: 1, cell: 2},
            {row: 1, cell: 1},
            {row: 1, cell: 0}
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
    if ($(".snakeHead").hasClass("snakeBody1") || $(".snakeHead").hasClass("snakeBody2")) {
        clearInterval(gameOn)
        endGame(); 
    } 
}

const checkFoodBombClash = (r, c) => {
    const $food = $(`#row${r}cell${c}`);
    if ($food.hasClass("snakeBody1")
    || $food.hasClass("snakeBody2")
    || $food.hasClass("snakeHead")
    || $food.hasClass("bomb")) {
        return true
    } else if ({row: r + 1, cell: c} === data.bomb[0]
        || {row: r - 1, cell: c} === data.bomb[0]
        || {row: r + 1, cell: c} === data.bomb[1]
        || {row: r - 1, cell: c} === data.bomb[1]) {
            return true;
    } else {
        return false
    }
}

// to generate random food box
// if food box coincides with snake body, regenerate the food box
const makeFood = () => {
    let row = Math.floor(Math.random() * data.arena.boxes);
    let cell = Math.floor(Math.random() * data.arena.boxes);

    while (checkFoodBombClash(row, cell)) {
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
        if (data.displaySpeed === "extreme" && data.foodCount % 5 === 0) {
            makeBomb();
        }
        
        updatePoints();
        makeFood();
        return true;
    } else {
        return false;
    }
}

//generate bomb
const makeBomb = () => {
    // clear previous bomb
    $(".bomb").removeClass("bomb")

    // generate coordinates for west(left-most) bomb
    let row = Math.floor(Math.random() * (data.arena.boxes - 2)) + 1;
    let cell = Math.floor(Math.random() * (data.arena.boxes - 2));

    //check if any of the five bombs coincides with food or snake class
    while (checkForClash(row, cell)) {
        row = Math.floor(Math.random() * data.arena.boxes);
        cell = Math.floor(Math.random() * data.arena.boxes);
    }    

    //store the final bomb coordinates in the data
    storeBombCoordinates(row, cell);
    //assign bomb classes according to the finalized bomb coordinates
    finalizeBomb();    
}

const storeBombCoordinates = (r, c) => {
    // 0: west bomb/left-most bomb
    data.bomb[0].row = r
    data.bomb[0].cell = c;
    // 1: east bomb/right-most bomb
    data.bomb[1].row = r;
    data.bomb[1].cell = c + 2;
    // 2: north bomb/top-most bomb
    data.bomb[2].row = r - 1;
    data.bomb[2].cell = c + 1;
    // 3: south bomb/bottom bomb
    data.bomb[3].row = r + 1;
    data.bomb[3].cell = c + 1;
    // 4: center bomb
    data.bomb[4].row = r;
    data.bomb[4].cell = c + 1;
}

//check if any of the five bombs coincides with food or snake class
const checkForClash = (r, c) => {
    storeBombCoordinates(r, c);
    for (let i = 0; i < data.bomb.length; i++) {
        const $bomb = $(`#row${data.bomb[i].row}cell${data.bomb[i].cell}`)
        if ($bomb.hasClass("snakeBody1")
        || $bomb.hasClass("snakeBody2")
        || $bomb.hasClass("snakeHead")
        || $bomb.hasClass("food")) {
            return true;
        }
    }
    return false;
}

//assign bomb classes according to the finalized bomb coordinates
const finalizeBomb = () => {
    for (let i = 0; i < data.bomb.length; i++) {
        const $bombCell = $(`#row${data.bomb[i].row}cell${data.bomb[i].cell}`)
        $bombCell.addClass("bomb")
    }
}

// check if snake head hits bomb
const checkBomb = () => {
    for (let i = 0; i < data.bomb.length; i++) {
        if (data.snake[0].row === data.bomb[i].row && data.snake[0].cell === data.bomb[i].cell) {
            $(".bomb").removeClass("bomb")
            clearInterval(gameOn)
            endGame(); 
        }
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
    $(".snakeBody1").removeClass("snakeBody1")
    $(".snakeBody2").removeClass("snakeBody2")
    $(".snakeHead").removeClass("snakeHead");
    // print snake based on updated snake body array
    for (let i = 0; i < data.snake.length; i++) {
        const $snakeID = $(`#row${data.snake[i].row}cell${data.snake[i].cell}`);
        if (i === 0) {
            $snakeID.addClass("snakeHead");
        } else if (i > 0) {
            if (i % 2 === 0) {
                $snakeID.addClass("snakeBody2")
            } else {
                $snakeID.addClass("snakeBody1")
            }
        }
    }
    // check if snake head hits any part of the snake body
    checkHitOwnTail();
    // only in extreme mode: check if snake head hits the bomb
    if (data.displaySpeed === "extreme") {
        checkBomb();
    }
}

const initGame = (speed) => {
    makePoints();
    makeTable();
    
    // stores set Interval as a global variable so that we can stopInterval to end the game later
    gameOn = setInterval(showSnake, speed);   
    makeFood();
    if (data.displaySpeed === "extreme") {
        makeBomb();
    }
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

// extreme mode chosen
const handleStartExtreme = () => {
    $("#rules").remove();
    data.speed = 50;
    data.displaySpeed = "extreme";
    initGame(data.speed);
}

const startingPage = () => {
    // create mode choice buttons using divs
    const $speedOption = $("<div>").addClass("speedOption").text("Choose a difficulty level to start:")
    const $easy = $("<div>").addClass("easyButton").text("EASY").on("click", handleStartEasy)
    const $medium = $("<div>").addClass("mediumButton").text("MEDIUM").on("click", handleStartMedium)
    const $hard = $("<div>").addClass("hardButton").text("HARD").on("click", handleStartHard)
    const $extreme = $("<div>").addClass("extremeButton").text("EXTREME").on("click", handleStartExtreme)
    $speedOption.append($easy, $medium, $hard, $extreme)
    // create intro to game
    const $rules = $("<div>").attr("id", "rules")
    $rules.text("Welcome to Hungry Snake")
    const $p =  $("<p>").attr("id", "innerRules").text("Use your arrow keys to guide the snake to its food, avoid the walls and do not eat your own tail! **avoid the bomb in extreme mode**")
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
