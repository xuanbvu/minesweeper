function Cell(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.neighborCount = 0;
    this.mine = false;
    this.revealed = false;
    this.flagged = false;
    this.wrong = false;
}

Cell.prototype.show = function() {
    if (this.wrong) {
        fill("red");
    }
    else {
        noFill();
    }
    rect(this.x, this.y, this.w);

    if (this.revealed) {
        if (this.mine) {
            if (!this.flagged) {
                fill(127);
                ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
            }
        }
        else {
            fill(200);
            rect(this.x, this.y, this.w);
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                textSize(18);
                fill(0);
                text(this.neighborCount, this.x + this.w * 0.5, this.y +  this.w * 0.6);
            }
        }
    }

    if (this.flagged) {
        fill(127);
        triangle(this.x + this.w * 0.5, this.y + this.w * 0.25, this.x + this.w * 0.25, this.y + this.w * 0.75, this.x + w * 0.75, this.y + this.w * 0.75);
    }
}

Cell.prototype.countMines = function() {
    if (this.mine) {
        this.neighborCount = -1;
    }
    var total = 0;
    for (var row = -1; row <= 1; row++) {
        for (var col = -1; col <= 1; col++) {
            var i = this.i + row;
            var j = this.j + col;
            if (i > -1 && i < rows && j > -1 && j < cols) {
                var neighbor = grid[i][j];
                if (neighbor.mine) {
                    total++;
                }
            }
        }
    }
    this.neighborCount = total;
}

Cell.prototype.reveal = function() {
    this.revealed = true;
    if (this.neighborCount == 0) {
        this.floodFill();
    }
}

Cell.prototype.flag = function() {
    if (!this.revealed) {
        if (this.flagged) {
            this.flagged = false;
        }
        else if (!this.flagged) {
            this.flagged = true;
        }
    }
}

Cell.prototype.floodFill = function() {
    for (var row = -1; row <= 1; row++) {
        for (var col = -1; col <= 1; col++) {
            var i = this.i + row;
            var j = this.j + col;
            if (i > -1 && i < rows && j > -1 && j < cols) {
                var neighbor = grid[i][j];
                if (!neighbor.mine && !neighbor.revealed && !neighbor.flagged) {
                    neighbor.reveal();
                }
            }
        }
    }
}