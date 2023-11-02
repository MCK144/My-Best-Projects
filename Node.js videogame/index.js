//************ SERVER METHODS ****************
var express = require("express");
//create the appliction
var app = express();
//create the server
var server = app.listen(5000);
//serve the 'public' folder 
app.use(express.static("public"));
var socket = require("socket.io");
io = socket(server);
console.log("***********server start ***************");

//************ Imports ****************

const fs = require("fs");//file writing purposes
var log = "";

//game imports
const Sprite = require("./Sprite.js");
const Player = require("./Player.js");
const {Police,SwatOfficer} = require("./Police.js");
const Citizen = require("./Citizen.js");
const {Gun,MedKit,Item} = require("./Item.js");
const Criminal = require("./Criminal.js");
const FPSManager = require("./FPSManager.js");
const Grid = require("./Grid.js");
const BulletSpawner = require("./BulletSpawner.js");
const EntityManager = require("./EntityManager.js");
const Building = require("./Building.js");
const AudioEngine = require("./AudioEngine.js");


//************** GAME START **********************
const WORLD_W = 4200; //10000
const WORLD_H = 3600; // 10000
const CLIENT_SCREEN_WIDTH = 900;
const CLIENT_SCREEN_HEIGHT = 600;

const NUM_CRIMINALS = 100;
const NUM_CITIZENS = 100;
const NUM_ITEMS = 100;
const START_COPS = 200;

//spatial partitioning methods
const CELL_SIZE = 600;
Grid.initialize(WORLD_W,WORLD_H,CELL_SIZE);

var entityManager = new EntityManager();


//game methods
var numPlayers = 0;

//holds all the data to go to the client
var serverData = [[],[],[],[],[],[],[],[],[]];

//references to each of the lists in 'serverData'
var citizens = serverData[0];
var players = serverData[1];
var items = serverData[2];
BulletSpawner.bullets = serverData[3];
var criminals = serverData[4];
var buildings = serverData[5];
var police = serverData[6];
//serverData[7] - sounds
var streets = [];


//setup the game
createCitizens();
createCriminals();
createCops();
createItems();
generateCity();

//player setup
io.sockets.on("connection",function(client){

	// get the player IP - disabled for now
	client.on("playerIp",function(data){
		return;
		console.log("New connection: " + data);

		var date = new Date();
		var day = date.getDate().toString();
		var month = (date.getMonth() + 1).toString();
		var hour = date.getHours();
		var minute = date.getMinutes().toString();
		

		log += data + " - accessed on " + month + "/" + day;
		log +=" at " + hour + ":" + minute + "\n";

		
		fs.writeFile("log.txt",log,function(err){
			console.log("Error: Could not write to file");
		});
	});

	// spawn a new player
	let spawn = randomWorldPos();
	var player = new Player(spawn[0],spawn[1],numPlayers);
	players[numPlayers++] = player;
	
	//broadcast the play index back to the client so it knows'
	//which player it owns
	client.emit("getPlayerIndex",numPlayers - 1);

	//upload all the static data (streets) to the player once
	client.emit("getStaticData",streets);
	//upload the grid data (for rendering spatial partitioning lines)

	var data = { width: Grid.width,height: Grid.height, cellSize: Grid.cellSize, 
						 xCells: Grid.numXCells, yCells: Grid.numYCells};
						 
	client.emit("getGrid",data);
	

	// update the client key state
	client.on("keyUpdate",function(keys){
		player.keys = keys;
	});

	client.on("playerClick",function(data){
		player.click = true;
		data[0] += player.sprite.x + player.sprite.w / 2;
		data[1] += player.sprite.y + player.sprite.h / 2;
		player.mousePos = data;
	});
	
	client.on("disconnect", function(){		
		//update the player indicies for all other players
		io.sockets.emit("updatePlayerIndex",player.playerIndex);
		
		//delete the player
		players.splice(player.playerIndex,1);
		numPlayers--;
		//remove the player from the grid
		Grid.removeAgent(player);
		
	});
	
	
});

function randomWorldPos(){
	let randX = Math.floor(Math.random() * WORLD_W);
	let randY = Math.floor(Math.random() * WORLD_H);
	return [randX,randY];
}

function serverUpdate(){
	//clear all the sounds
	AudioEngine.reset();

	//update the items
	for (let i = 0; i < items.length; i++){
		if (items[i].update(players)){
			items.splice(i,1);
		}
	}
	
	//update the entities
	entityManager.updateEntities(players,citizens,criminals);
	
	//sound data
	serverData[7] = AudioEngine.sounds;
	
	io.sockets.emit("serverUpdate",serverData);

}

function generateCity(){
	const STREET_WIDTH = 200;
	const STREET_LENGTH = CELL_SIZE * 2;

	//create horizontal streets
	for (let y = CELL_SIZE - STREET_WIDTH / 2; y < WORLD_H; y += CELL_SIZE * 2){
		for (let x = 0; x < WORLD_W; x += CELL_SIZE * 2){
			let newStreet = new Sprite(x,y,STREET_LENGTH,STREET_WIDTH,"textures/City/street_horizontal.png");
			streets[streets.length] = newStreet;
		}
	}

	//create vertical streets
	for (let x = CELL_SIZE * 2 - STREET_WIDTH / 2; x < WORLD_W; x += CELL_SIZE * 2){
		for (let y = 0; y < WORLD_H; y += CELL_SIZE * 2){
			let newStreet = new Sprite(x,y,STREET_WIDTH,STREET_LENGTH,"textures/City/street_vertical.png");
			streets[streets.length] = newStreet;
		}
	}
	
	const BUILDING_WIDTH = 400;
	const BUILDING_HEIGHT = 200;
	
	const PADDING = 10;
	//create the buildings
	for (let y = 0; y < WORLD_H; y+= CELL_SIZE){
		for (let x = 0; x < WORLD_W; x+= CELL_SIZE){
			let building =  new Building(x + STREET_WIDTH / 2 + PADDING,y + BUILDING_HEIGHT / 2 + PADDING);
			buildings[buildings.length] = building;
		}
	}
}

function createCitizens(){	
	for (let i = 0; i < NUM_CITIZENS; i++){
		let pos = randomWorldPos();
		let newCitizen = new Citizen(pos[0],pos[1]);
		citizens[citizens.length] = newCitizen;
	}

}

function createItems(){	
	const ITEM_WIDTH = 25;
	const ITEM_HEIGHT = 25;
	
	for (let i = 0; i < NUM_ITEMS; i++){
		let pos = randomWorldPos();

		let pick = Math.floor(Math.random() * 4);
		//spawn gun
		if (pick == 0)
			items.push(new Gun(pos[0],pos[1],ITEM_WIDTH,ITEM_HEIGHT,
				"textures/Items/gun.png","gun","gunshot.wav"));
		//medkit
		else if (pick == 1)
			items.push(new MedKit(pos[0],pos[1],ITEM_WIDTH,ITEM_HEIGHT,
				"textures/Items/medkit.png","medkit","munch.wav"));
		else if (pick == 2)
			items.push(new Item(pos[0],pos[1],ITEM_WIDTH,ITEM_HEIGHT,
				"textures/Items/kill_glove.png","kill_glove","super_punch.mp3"));
		else
			items.push(new Item(pos[0],pos[1],ITEM_WIDTH,ITEM_HEIGHT,
				"textures/Items/slam_glove.png","slam_glove","super_punch.mp3"));
	}
}

function createCriminals(){	
	for (let i = 0; i < NUM_CRIMINALS; i++){
		let pos = randomWorldPos();
		let threatLevel = Math.floor(Math.random() * 4 + 1);
		let crook = new Criminal(pos[0],pos[1],threatLevel);
		
		criminals[criminals.length] = crook;
	}
}

function createCops(){	
	for (let i = 0; i < START_COPS/2; i++){
		let pos = randomWorldPos()
		let copper = new Police(pos[0],pos[1]);
		police[police.length] = copper;
	}
	for (let i = 0; i < START_COPS/2; i++){
		let pos = randomWorldPos()
		let copper = new SwatOfficer(pos[0],pos[1]);
		police[police.length] = copper;
	}
	
}
	

setInterval(serverUpdate,1000/60);

//OPTIMIZATION IDEAS
//1 - criminals only reset their target players/citizens every 100 frames instead of every frame
//2 - criminals use the spatial partitioning to locate the nearest player, not the distance formula