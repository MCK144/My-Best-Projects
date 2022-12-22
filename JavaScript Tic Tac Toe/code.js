var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext("2d");
var screenWidth = canvas.width;
var screenHeight = canvas.height;

var form = document.getElementById("form");
var xField = document.getElementById("enterX");
var yField = document.getElementById("enterY");
var feedback = document.getElementById("feedback");


//board methods
var boardColor = "lightgray";
var board = [['.','.','.'],['.','.','.'],['.','.','.']];
const GRID_WIDTH = 10;
const X_WIDTH = 20;
const O_WIDTH = 20;
var play = true;

const TILE_WIDTH = screenWidth / 3;

const X_COLOR = "blue";
const O_COLOR = "red";


function drawBoard(){
	//clear the old board
	context.fillStyle = boardColor;
	context.fillRect(0,0,screenWidth,screenHeight);
	
	//*****draw outline
	context.strokeStyle = "black";
	context.lineWidth = GRID_WIDTH;
	
	context.beginPath();
	context.moveTo(screenWidth / 3,0);
	context.lineTo(screenWidth / 3,screenHeight);
	context.stroke();
	
	context.beginPath();
	context.moveTo(screenWidth * 2 / 3,0);
	context.lineTo(screenWidth * 2/ 3,screenHeight);
	context.stroke();
	
	context.beginPath();
	context.moveTo(0,screenHeight/3);
	context.lineTo(screenWidth, screenHeight / 3);
	context.stroke();
	
	context.beginPath();
	context.moveTo(0,screenHeight * 2 / 3);
	context.lineTo(screenWidth,screenHeight * 2 / 3);
	context.stroke();
	
	//draw the player moves
	for (let y = 0; y < board.length; y++){
		for (let x = 0; x < board[y].length; x++){
			let tile = board[y][x];
			
			//draw an X on this tile
			if (tile == "x"){
				context.lineWidth = X_WIDTH;
				context.strokeStyle = X_COLOR;
				context.beginPath();
				context.moveTo(TILE_WIDTH * x,TILE_WIDTH*y);
				context.lineTo(TILE_WIDTH * x + TILE_WIDTH, TILE_WIDTH * y + TILE_WIDTH);
				context.stroke();
				
				context.beginPath();
				context.moveTo(TILE_WIDTH * x + TILE_WIDTH,TILE_WIDTH*y);
				context.lineTo(TILE_WIDTH * x, TILE_WIDTH * y + TILE_WIDTH);
				context.stroke();
			}
			else if (tile == "o"){
				context.lineWidth = O_WIDTH;
				context.strokeStyle = O_COLOR;
				
				context.beginPath();
				context.arc(TILE_WIDTH * x + TILE_WIDTH / 2,
				TILE_WIDTH * y + TILE_WIDTH / 2, TILE_WIDTH/3,0,Math.PI * 2);
				context.stroke();
			}
			
		}
	}
};

function playerMove(){
	if (!play) return;
	
	if (xField.value == "" || yField.value == ""){
		feedback.style.color = "red";
		feedback.innerHTML = "***Enter both fields***";
		return;
	}
	
	let x = Number(xField.value) - 1;
	let y = Number(yField.value) - 1;

	
	if (x < 0 || x > 3 || y < 0 || y > 3){
		feedback.style.color = "red";
		feedback.innerHTML = "***Invalid range***";
		return;
	}
	
	if (board[y][x] != "."){
		feedback.style.color = "red";
		feedback.innerHTML = "***Spot already taken***";
		return;
	}
	
	board[y][x] = "x";
	drawBoard();
	checkForWin();
	computerMove();
}

function computerMove(){
	if (!play) return;
	
	let spotFound = false;
	
	while (spotFound == false){
		let x = Math.floor(Math.random() * 3);
		let y = Math.floor(Math.random() * 3);
		
		if (board[x][y] == "."){
			spotFound = true;
			board[x][y] = "o";
		}
	}
	
	drawBoard();
	checkForWin();
}

function checkForWin(){
	let winner = ".";
	
	//check diagonal
	if (board[0][0] == board[1][1] && board[1][1] == board[2][2]){
		winner = board[0][0];
	}
	else if (board[0][2] == board[1][1] && board[1][1] == board[2][0]){
		winner = board[0][2];
	}
	//check horizontal
	else if (board[0][0] == board[0][1] && board[0][1] == board[0][2]){
		winner = board[0][0];
	}
	else if (board[1][0] == board[1][1] && board[1][1] == board[1][2]){
		winner = board[1][0];
	}
	else if (board[2][0] == board[2][1] && board[2][1] == board[2][2]){
		winner = board[2][0];
	}
	//check vertical
	else if (board[0][0] == board[1][0] && board[1][0] == board[2][0]){
		winner = board[0][0];
	}
	else if (board[0][1] == board[1][1] && board[1][1] == board[2][1]){
		winner = board[0][1];
	}
	else if (board[0][2] == board[1][2] && board[1][2] == board[2][2]){
		winner = board[0][2];
	}
	
	if (winner == "x"){
		feedback.style.color = "green";
		feedback.innerHTML = "You win!";
		play = false;
	} else if (winner == "o"){
		feedback.style.color = "red";
		feedback.innerHTML = "You lose!";
		play = false;	
	}
}

form.addEventListener("submit",function(event){
	event.preventDefault();
	
	playerMove();
});

drawBoard();