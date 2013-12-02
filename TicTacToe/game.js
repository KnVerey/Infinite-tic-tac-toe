// Intro screen has transparency. Offers several board sizes, or maybe a dropdown of odd numbers.
// On hover, relevant board size displays in bkdg. On click, wrapper fades out.

$(document).ready (function(){
	window.game = new Game(3);
	window.game.start();
});


function Game(boardSize) {
	this.boardSize = boardSize;
	this.boxes = [];
	this.turn = "X";

	this.start = function(){
		for(var x=0; x<boardSize; x++) {
			for(var y=0; y<boardSize; y++) {
				var box = new Box (x,y);
				box.render();
				this.boxes.push(box);
			}
		}
	};

	this.toggleTurn = function() {
		if (this.turn === "X") {
			this.turn = "Y";
		} else if (this.turn === "Y") {
			this.turn = "X";
		}
	};
}

function Box(x,y) {
	this.x = x;
	this.y = y;
	this.size = Math.ceil((30/window.game.boardSize)) ;

	this.render = function() {
		this.$me = $("<div class='box'></div");
		$(this.$me)
			.css("height", this.size+"em")
			.css("width", this.size+"em")
			.on("click", function(){
				if (this.innerHTML==="") {
					this.innerHTML = "<p class='marker'>" + window.game.turn + "</p>";
					window.game.toggleTurn();
				}
			});

		$("#gameboard").append(this.$me);
	};

}