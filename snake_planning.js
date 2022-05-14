//Object: Data storage:
    //table size: rows, columns, no. of cells, cell size
    //snake properties
        //starting snake length
        //starting snake position (based on cell position) 
            //(ARRAY of objects) where each object = one cell position
            //eg. array[0] = (head) {row: x, cell: y}
        //snake food count

//function: to check if food is eaten

//function: to make food appear (only one at any one time)

//function: check if snake hit wall
    // end game if hit

// functions x 4 : moveLeft, moveRight, moveUp, moveDown
    // pop the last tail
    // come up with new snake head position based on direction
    // unshift the new head to start of array


// code to update direction that the snake is going, which is stored in the object
    // include check for direction errors 
    // e.g. if snake going left but right arrow pressed
    
// function: update snake
    // calls specific directional movement function 
    // based on stored "direction" in the object
    // i.e. if snake direction = right, call moveRight();

//function: showSnake
    // call clear snake function
    // makes snake based on snake properties length + position 
    // ? assign class to snake?

// MAIN function to move snake
    // ? use set time out? set interval?
    // if snake doesn't hit wall, 
        // call update snake function
        // call show snake function
        // call move snake function again

//function: makeTable
    //makes table using table size in objects
    //appends to div.container

//function: update points
    //calls show points function

//function: show points

//function: showGameArena
    //calls make table function

//function: initgame:
    //calls showGameArena 
    //calls showSnake

//function: handle start game button
    //removes startgame button (empty div.container)
    //calls initgame

//function: initializing game 
    //make start button (on click activates handle start game function)


$(() => {
    // call main
})

