import {Renderer} from "./renderer.js";
import {Camera} from "./Camera.js";

var socket = io.connect("localhost:5000");



// renders all server data for the client
var renderer = new Renderer;
// translates all positions relative to this client's player
var camera = new Camera;
// the client's key state to be processed by the server
var keys = {
	w:false,
	a:false,
	s:false,
	d:false,
	space:false,
	zero: false,
	one: false,
	two: false,
	three: false,
	four: false
};
var keyDown = false;

//used so that the client can calculate click positions
var canvas = renderer.getCanvas();
const cr = canvas.getBoundingClientRect(); //stands for canvas rect
// the player id for this client (to keep track of camera movement)
var playerIndex = 0;
var grid = null;

const CITIZENS = 0;
const PLAYERS = 1;
const CROOKS = 4;
const COPS = 6;
const SOUND = 7;

socket.on("connect",function(){
	//set the player index so the client knows which player is its
	socket.on("getPlayerIndex",function(data){
		playerIndex = data;
	});

	socket.on("getStaticData",function(data){
		renderer.staticData = data;
	});
	
	socket.on("getGrid",function(data){
		grid = data;
		renderer.grid = grid;
	});

	socket.on("updatePlayerIndex",function(deletedPlayerIndex){
		if (playerIndex > deletedPlayerIndex){
			playerIndex--;
		}
	});

	//upload this user's IP
	let ip;
	fetch('https://api.ipify.org/?format=json')
	  .then(response => { return response.json();})
		.then(response => 
			{ 
				ip = response.ip;
				var data = [response.ip];
				socket.emit("playerIp", data);
			});
	
	//server update
	socket.on("serverUpdate",function(data){
		//clear the background
		renderer.clear();

		//update the camera
		camera.update(data[1][playerIndex].sprite);

		//draw streets
		renderer.drawStaticData(camera);

		//draw the buildings
		let player = data[1][playerIndex];

		for (let i = 0; i < data[5].length; i++){
			renderer.drawBuilding(data[5][i],camera,player);
		}

		//draw the citizens
		let numCitizens = data[CITIZENS].length;
		for (let i = 0; i < data[CITIZENS].length; i++){
			renderer.drawSprite(data[CITIZENS][i].sprite,camera);
			/*if (data[CITIZENS][i].attackBox.active){
				renderer.drawHitbox(data[CITIZENS][i].attackBox,camera);
			}*/
			//for the GUI
			if (data[CITIZENS][i].sprite.dead){
				numCitizens--;
			}
		}
		
		//draw the criminals
		let numCriminals = data[CROOKS].length;
		for (let i = 0; i < data[CROOKS].length; i++){
			renderer.drawSprite(data[CROOKS][i].sprite,camera);
			/*if (data[CROOKS][i].attackBox.active){
				renderer.drawHitbox(data[CROOKS][i].attackBox,camera);
			}*/
			if (data[CROOKS][i].sprite.dead){
				numCriminals--;
			}
		}
	
		//draw the police
		let numCops = data[COPS].length;
		for (let i = 0; i < data[COPS].length; i++){
			renderer.drawSprite(data[COPS][i].sprite,camera);
			/*if (data[COPS][i].attackBox.active){
				renderer.drawHitbox(data[COPS][i].attackBox,camera);
			}*/
			if (data[COPS][i].sprite.dead)
				numCops--;
		}
	
		//draw items
		for (let i = 0; i < data[2].length; i++){
			renderer.drawSprite(data[2][i],camera);
		}

		//draw bullets
		for (let i = 0; i < data[3].length; i++){
			renderer.drawBullet(data[3][i],camera);
		}

		//draw players
		for (let i = 0; i < data[1].length; i++){
			renderer.drawSprite(data[1][i].sprite,camera);
			/*if (data[1][i].attackBox.active){
				renderer.drawHitbox(data[1][i].attackBox,camera);
			}*/

			//draw the player GUI
			if (data[1][i].playerIndex == playerIndex){
				renderer.drawGUI(data[1][i],numCitizens,numCriminals,numCops);
				renderer.drawPlayerInventory(data[1][i]);
			}
		}
		
		
		//draw the grid
		//renderer.drawGrid(camera);
		
		playSounds(player,data[SOUND]);
	});
});

const FILE_EXTENSION = "sounds/";

/*var soundCache = {
	"sounds/punch.mp3" : new Audio("sounds/punch.mp3"),
	"sounds/kick.mp3" : new Audio("sounds/kick.mp3"),
	"sounds/gunshot.mp3" : new Audio("sounds/gunshot.mp3"),
	"sounds/break.mp3" : new Audio("sounds/break.mp3")
}*/

function playSounds(localPlayer, sounds){
	sounds.forEach(function(sound,index){
		
		//play sound in the player's cell
		if (sound.ownerCell == localPlayer.ownerCell){
			//soundCache[FILE_EXTENSION + sound.path].load();
			//soundCache[FILE_EXTENSION + sound.path].play();
			let audio = new Audio(FILE_EXTENSION + sound.path);
			audio.play();
		}
		
		//play sounds in surrounding cells
		for (let i = 0; i < localPlayer.surroundingCells.length; i++){
			let index = localPlayer.surroundingCells[i];
			if (sound.ownerCell == index){
				let audio = new Audio(FILE_EXTENSION + sound.path);
				audio.play();
			}
		}
		
	});
}

window.addEventListener("keydown",function(event){
	if (keyDown == true)
		return;
	
	keyDown = false;
	
	let broadcast = false;
	let key = event.key;
	
	if (key == 'w'){
		keys['w'] = true;
		broadcast = true;
	}
	if (key == 'a'){
		keys['a'] = true;
		broadcast = true;
	}
	if (key == 's'){
		keys['s'] = true;
		broadcast = true;
	}
	if (key == 'd'){
		keys['d'] = true;
		broadcast = true;
	}
	if (key == ' '){
		keys['space'] = true;
		broadcast = true;
	}
	if (key == '0'){
		keys['zero'] = true;
		broadcast = true;
	}
	if (key == '1'){
		keys['one'] = true;
		broadcast = true;
	}
	if (key == '2'){
		keys['two'] = true;
		broadcast = true;
	}
	if (key == '3'){
		keys['three'] = true;
		broadcast = true;
	}
	if (key == '4'){
		keys['four'] = true;
		broadcast = true;
	}

	//broadcast the data back to the server only if 
	// a real key was pressed
	if (broadcast)
		socket.emit("keyUpdate",keys);
});

window.addEventListener("keyup",function(event){
	keyDown = false;
	let broadcast = false;
	
	let key = event.key;
	if (key == 'w'){
		keys['w'] = false;
		broadcast = true;
	}
	if (key == 'a'){
		keys['a'] = false;
		broadcast = true;
	}
	if (key == 's'){
		keys['s'] = false;
		broadcast = true;
	}
	if (key == 'd'){
		keys['d'] = false;
		broadcast = true;
	}
	if (key == ' '){
		keys['space'] = false;
		broadcast = true;
	}
	if (key == '0'){
		keys['zero'] = false;
		broadcast = true;
	}
	if (key == '1'){
		keys['one'] = false;
		broadcast = true;
	}
	if (key == '2'){
		keys['two'] = false;
		broadcast = true;
	}
	if (key == '3'){
		keys['three'] = false;
		broadcast = true;
	}
	if (key == '4'){
		keys['four'] = false;
		broadcast = true;
	}

	if (broadcast)
		socket.emit("keyUpdate",keys);
});

window.addEventListener("click",function(event){
	let data = [0,0];
	
	//calculate the click position
	data[0] = ((event.clientX - cr.left) / (cr.right - cr.left)) * canvas.width;
	data[1] = ((event.clientY - cr.top) / (cr.bottom - cr.top)) * canvas.height;

	//subtract the dimensions of the canvas
	data[0] -= canvas.width / 2;
	data[1] -= canvas.height / 2;

	//the server will handle adding back the player's position
	socket.emit("playerClick",data);

});