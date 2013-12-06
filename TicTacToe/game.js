(function($) {

	$(document).ready (function(){
		initializeGame();
	});

	// refactor to be part of game (and called immediately, but not as SEF for clarity)
	// can't? need to use to create new instances, including on reset. Could redistribute code to do it though. Better?
	function initializeGame() {
		var height = $("#gameboard").height();
		var size = Math.round(+prompt("Enter a board size (must be an ODD number and will max out if your window is too small):"));

		if (height/size < 30 ) { size = Math.floor(height/30); }
		if (size%2===0) { size += 1; }

		$("#gameboard").css("width", height);
		$("body").css("fontSize", (height/size - (height/size/10) + "px"));

		window.game = new Game(size);
		window.game.start();
	}


	function Game(boardSize) {
		this.boardSize = boardSize;
		this.centerIndex = (boardSize - 1) / 2;
		this.board = [];
		this.turn = "X";

		this.start = function() {
			for (var x = 0; x < boardSize; x++) {
				var row = [];

				for (var y = 0; y < boardSize; y++) {
					var box = new Box(x, y);

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
			if ( y === this.boardSize ) return true;
			if ( this.board[x][y].player !== this.turn ) return false;

			return this.rowWin(x, y + 1);
		};

		this.columnWin = function (x, y) {
			if ( x === this.boardSize ) return true;
			if ( this.board[x][y].player !== this.turn ) return false;

			return this.columnWin(x + 1, y);
		};

		this.diagonalWin = function (x, y) {
			// (x = x || defaultValue) doesn't work b/c 0 is possible and returns false
			var x  = ( x === undefined ? this.centerIndex : x );
			var y  = ( y === undefined ? this.centerIndex : y );

			if ( x < 0 || x === this.boardSize ) return true;
			if ( this.board[x][y].player !== this.turn ) return false;

			var direction = this.quandrantCheck(x, y); // okay to put here because not needed if don't get here?
			if ( direction ) {
				return this.diagonalWin(direction.x, direction.y);
			}

			return ( (this.diagonalWin(x - 1, y + 1) && this.diagonalWin(x + 1, y - 1)) || (this.diagonalWin(x + 1, y + 1) && this.diagonalWin(x -1, y -1)) );
		};

		this.quandrantCheck = function(x, y) {
			var value = {};

			if ( x > this.centerIndex && y > this.centerIndex ) {
				value.x = x + 1;
				value.y = y + 1;
			} else if ( x < this.centerIndex && y < this.centerIndex ) {
				value.x = x - 1;
				value.y = y - 1;
			} else if ( x > this.centerIndex && y < this.centerIndex ) {
				value.x = x + 1;
				value.y = y - 1;
			} else if ( x < this.centerIndex && y > this.centerIndex ) {
				value.x = x - 1;
				value.y = y + 1;
			} else {
				return false;
			}

			return value;
		};


		this.checkWin = function(box) {
			if (this.rowWin(box.x, 0)) {
				return true;
			} else if (this.columnWin(0, box.y)) {
				return true;
			} else if (this.board[game.centerIndex][game.centerIndex].player !== "") {
					if (this.diagonalWin()) return true;
			} else {
				return false;
			}
		};

		this.reset = function() {
			$("#gameboard").children().remove();
			initializeGame();
		};

	}

	function Box(x, y) {
		var objectBox = this;

		this.x = x;
		this.y = y;
		this.player = "";
		this.size = Math.floor(($("#gameboard").width() / game.boardSize));

		this.render = function() {
			this.$me = $("<div class='box'></div");

			$(this.$me)
				.css("height", this.size + "px")
				.css("width", this.size + "px")
				.on("click", function(){
					if (objectBox.player === "") {
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

})(jQuery);
