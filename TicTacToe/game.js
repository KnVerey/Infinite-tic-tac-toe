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
		this.topleft = [-1, 1];
		this.topright = [1, 1];
		this.bottomleft = [-1, -1];
		this.bottomright = [1, -1];

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

		this.diagonalWin = function (x, y, quadrant) {
			// set default values for first call
			var x  = ( x === undefined ? this.centerIndex : x );
			var y  = ( y === undefined ? this.centerIndex : y );

			// exit if off board or not current player
			if ( x < 0 || x === this.boardSize ) return true;
			if ( this.board[x][y].player !== this.turn ) return false;

			// skipped on first call only
			if (quadrant) {
				x = x + quadrant[0];
				y = y + quadrant[1];
				return this.diagonalWin(x, y, quadrant);
			}

			return ((this.diagonalWin(x, y, this.topleft) && this.diagonalWin(x, y, this.bottomright)) || (this.diagonalWin(x, y, this.topright) && this.diagonalWin(x, y, this.bottomleft)));
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
