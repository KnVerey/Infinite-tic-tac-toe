$(document).ready (function(){
	initializeGame();
});

function initializeGame() {
	var size = +prompt("Enter a board size (odd number please!):");
	if (size%2===0) size += 1;

	var height = $("#gameboard").height();
	$("#gameboard").css("width", height);
	document.body.style.fontSize = height/size - (height/size/10) + "px";
	window.game = new Game(size);
	window.game.start();
}


function Game(boardSize) {
	this.boardSize = boardSize;
	this.centerIndex = (boardSize - 1) / 2;
	this.board = [];
	this.turn = "X";

	this.start = function(){
		for(var x=0; x<boardSize; x++) {
			var row = [];
			for(var y=0; y<boardSize; y++) {
				var box = new Box (x,y);
				box.render();
				row.push(box);
			}
			this.board.push(row);
		}
	};

	this.toggleTurn = function() {
		if (this.turn === "X") {
			this.turn = "O";
		} else if (this.turn === "O") {
			this.turn = "X";
		}
	};

	this.rowWin = function (x, y) {
		if (y === this.boardSize) return true;
		if (this.board[x][y].player !== this.turn) return false;
		return this.rowWin(x, y+1);
	};

	this.columnWin = function (x, y) {
		if (x === this.boardSize) return true;
		if (this.board[x][y].player !== this.turn) return false;
		return this.columnWin(x+1, y);
	};

	this.downDiagonalWin = function (x, y) {
		if (x < 0 || x === this.boardSize) return true;

		if (this.board[x][y].player !== this.turn) return false;

		if (x > this.centerIndex) {
			return this.downDiagonalWin(x+1, y+1);
		} else if (x < this.centerIndex) {
			return this.downDiagonalWin(x-1, y-1);
		} else if (x === this.centerIndex){
			return (this.downDiagonalWin(x+1, y+1) && this.downDiagonalWin(x-1, y-1));
		}
	};

	this.upDiagonalWin = function (x, y) {
		if (x < 0 || x === this.boardSize) {
			return true;
		}

		if (this.board[x][y].player !== this.turn) {
			return false;
		}

		if (x > this.centerIndex) {
			return this.upDiagonalWin(x+1, y-1);
		} else if (x < this.centerIndex) {
			return this.upDiagonalWin(x-1, y+1);
		} else if (x === this.centerIndex){
			return (this.upDiagonalWin(x-1, y+1) && this.upDiagonalWin(x+1, y-1));
		}
	};

	this.checkWin = function(box) {
		if (this.rowWin(box.x, 0)) {
			return true;
		} else if (this.columnWin(0, box.y)) {
			return true;
		} else if (this.downDiagonalWin(this.centerIndex, this.centerIndex)) {
			return true;
		} else if (this.upDiagonalWin(this.centerIndex, this.centerIndex)){
			return true;
		} else {
			return false;
		}
	};

	this.reset = function() {
		$("#gameboard").children().remove();
		initializeGame();
	};
}

function Box(x,y) {
	this.x = x;
	this.y = y;
	this.player = "";
	this.size = Math.floor(($("#gameboard").width()/window.game.boardSize));
	var objectBox = this;

	this.render = function() {
		this.$me = $("<div class='box'></div");
		$(this.$me)
			.css("height", this.size+"px")
			.css("width", this.size+"px")
			.on("click", function(){
				if (objectBox.player==="") {
					this.innerHTML = "<p class='marker'>" + window.game.turn + "</p>";
					objectBox.player = window.game.turn;
					gameOver = window.game.checkWin(objectBox);

					if (gameOver) {
						alert("Game over! " + window.game.turn + " won!");
						window.game.reset();
					} else {
						window.game.toggleTurn();
					}
				}
			});

		$("#gameboard").append(this.$me);
	};

}