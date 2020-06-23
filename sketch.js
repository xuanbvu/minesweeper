function make2DArray(rows, cols) {
    var arr = new Array(rows);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

var grid;
var rows;
var cols;
var w = 50;
var cells = 10;

var mines = 1;

function setup() {
    playing = true;
    createCanvas(w * cells, w * cells);

    rows = floor(height / w);
    cols = floor(width / w);

    grid = make2DArray(rows, cols);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    var options = [];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            options.push([i, j]);
        }
    }
    for (var n = 0; n < mines; n++) {
        var index = floor(random(options.length));
        var i = options[index][0];
        var j = options[index][1];
        options.splice(index, 1);
        grid[i][j].mine = true;
    }

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].countMines();
        }
    }
}

var playing = true;
var p;
var b;

function gameOver() {
    playing = false;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].mine) {
                grid[i][j].reveal();
            }
            if (grid[i][j].flagged && !grid[i][j].mine) {
                grid[i][j].wrong = true;
            }  
        }
    }
    b = createButton("New Game");
    b.mousePressed(newGame);
}

function gameWon() {
    playing = false;
    p = createP("Congratulations, you won!");
    b = createButton("New Game");
    b.mousePressed(newGame);
}

var rightPressed = false;
function mousePressed() {
    if (mouseButton == LEFT) {
        if (playing) {
            var i = floor(mouseX / w);
            var j = floor(mouseY / w);
            if (!grid[i][j].flagged) {
                grid[i][j].reveal();
                if (grid[i][j].mine) {
                    grid[i][j].wrong = true;
                    gameOver();
                }
            }
            var cleared = 0;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (grid[i][j].revealed && !grid[i][j].mine) {
                        cleared++;
                    }
                }
            }
            if (cleared == cells * cells - mines) {
                gameWon();
            }
        }
    }

    if (mouseButton == RIGHT) {
        if (mouseX < w * cells && mouseY < w * cells) {
            console.log("dont show");
            document.oncontextmenu = function() {
                return false;
            }
            if (playing) {
                var i = floor(mouseX / w);
                var j = floor(mouseY / w);
                grid[i][j].flag();
            }
        }
        else {
            console.log("go here");
            document.oncontextmenu = function() {
                return true;
            }
        }
        
    } 
}

function newGame() {
    p.remove();
    b.remove();
    setup();
}

function draw() {
    background(255);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }
}