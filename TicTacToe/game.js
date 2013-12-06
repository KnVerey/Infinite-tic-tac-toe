$(document).ready (function(){
	initializeGame();
});

function initializeGame() {
	var height = $("#gameboard").height();
	var size = Math.round(+prompt("Enter a board size (must be an ODD number and will max out if your window is too small):"));
	if (height/size < 30 ) { size = Math.floor(height/30); }
	if (size%2===0) { size += 1; }

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
		$("#player").html(this.turn);
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
		} else if (this.board[game.centerIndex][game.centerIndex].player !== "") {
			if ((this.downDiagonalWin(game.centerIndex, game.centerIndex)) ||
				(this.upDiagonalWin(game.centerIndex, game.centerIndex)))
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
	this.size = Math.floor(($("#gameboard").width()/game.boardSize));
	var objectBox = this;

	this.render = function() {
		this.$me = $("<div class='box'></div");
		$(this.$me)
			.css("height", this.size+"px")
			.css("width", this.size+"px")
			.on("click", function(){
				if (objectBox.player==="") {
					this.innerHTML = "<p class='marker'>" + game.turn + "</p>";
					objectBox.player = game.turn;
					gameOver = game.checkWin(objectBox);

					if (gameOver) {
						alert("Game over! " + game.turn + " won!");
						game.reset();
					} else {
						game.toggleTurn();
					}
				}
			});

		$("#gameboard").append(this.$me);
	};

}