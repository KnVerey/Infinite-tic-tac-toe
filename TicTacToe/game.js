// Intro screen has transparency. Offers several board sizes, or maybe a dropdown of odd numbers.
// On hover, relevant board size displays in bkdg. On click, wrapper fades out.

$(document).ready (function(){
	window.game = new Game(3);
	window.game.start();
});


function Game(boardSize) {
	this.boardSize = boardSize;
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
			this.turn = "Y";
		} else if (this.turn === "Y") {
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

	this.diagonalWin = function (x, y) {
		return false;
	};

	this.checkWin = function(box) {
		var centerIndex = boardSize % 2;
		if (this.rowWin(box.x, 0)) {
			return true;
		} else if (this.columnWin(0, box.y)) {
			return true;
		} else if (this.diagonalWin(centerIndex, centerIndex)) {
			return true;
		} else {
			return false;
		}
	};
}

function Box(x,y) {
	this.x = x;
	this.y = y;
	this.player = "";
	this.size = Math.ceil((30/window.game.boardSize));
	var objectBox = this;

	this.render = function() {
		this.$me = $("<div class='box'></div");
		$(this.$me)
			.css("height", this.size+"em")
			.css("width", this.size+"em")
			.on("click", function(){
				if (objectBox.player==="") {
					this.innerHTML = "<p class='marker'>" + window.game.turn + "</p>";
					objectBox.player = window.game.turn;
					gameOver = window.game.checkWin(objectBox);
					console.log(gameOver);

					if (gameOver) {
						alert("Game over! " + window.game.turn + " won!");
					} else {
						window.game.toggleTurn();
					}
				}
			});

		$("#gameboard").append(this.$me);
	};

}