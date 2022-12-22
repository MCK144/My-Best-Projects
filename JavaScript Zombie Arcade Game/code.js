const WINDOW_X = 1000;
const WINDOW_Y = 500;

var NUM_ZOMBIES = 200; // user enters this value
var ZOMBIE_SPEED = 0.9; // user enters this value as well

const ZOMBIE_DIMS = 40;
const ZOMBIE_COLOR = "rgb(20,200,3)";

var inputManager = {
	a_key : false,
	d_key : false,
	w_key : false,
	s_key : false,
	
	pressKey : function(){
		let key = event.code;

		switch (key){
			case "KeyA":
				inputManager.a_key = true;
				break;
			case "KeyD":
				inputManager.d_key = true;
				break;
			case "KeyS":
				inputManager.s_key = true;
				break;
			case "KeyW":
				inputManager.w_key = true;
				break;
			case "Tab":
				location.reload(); //refresh page if Q pressed
				break;
		}
	},
	releaseKey : function(){
		let key = event.code;
		switch (key){
			case "KeyA":
				inputManager.a_key = false;
				break;
			case "KeyD":
				inputManager.d_key = false;
				break;
			case "KeyS":
				inputManager.s_key = false;
				break;
			case "KeyW":
				inputManager.w_key = false;
				break;
			default:
				break;
		}
	}
	
}

class SpriteSheet{
	constructor(id, textureDims, imageWidth, imageHeight){
		this.id = id;
		this.textureDims = textureDims;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
	}

	getTextureCoords(index){
		//get the tile x and y on the spritesheet
		let x = index % this.textureDims[0];
		let y = Math.floor(index / this.textureDims[0]);

		let textureCoords = [0,0,0,0]
		textureCoords[0] = x * Math.floor(this.imageWidth / this.textureDims[0]);
		textureCoords[1] = y * Math.floor(this.imageHeight / this.textureDims[1]);
		textureCoords[2] = Math.floor(this.imageWidth / this.textureDims[0]);
		textureCoords[3] = Math.floor(this.imageHeight / this.textureDims[1]);
		
		return textureCoords;
	}
	
}

var game = {
	// the canvas is created in code instead of being included in the html
	canvas: document.createElement("canvas"),
	quitGame: false,
	score: 0,
	
	init: function(){
		window.addEventListener("keydown", inputManager.pressKey,false);
		window.addEventListener("keyup", inputManager.releaseKey,false);
		window.addEventListener("keyup", player.fire,false);
		
		//canvas methods
		//this.canvas = document.createElement("canvas");
		this.context = game.canvas.getContext("2d");
		this.canvas.width = WINDOW_X;
		this.canvas.height = WINDOW_Y;
		document.body.insertBefore(this.canvas,document.body.childNodes[2]);
		
		//game methods
		this.zombies = []
		this.bullets = []
	},
	play : function(){
		//create zombies
		for (let i = 0; i < NUM_ZOMBIES; i+=1){
			let dir = Math.random();
			if (dir < 0.5)
				dir = -1;
			else
				dir = 1;

			let correctSpawn = false;
			let randX = 0;
			let randY = 0;
			
			while (correctSpawn == false){
				randX = dir * Math.floor(Math.random() * WINDOW_X * 5);
				randY =  dir * Math.floor(Math.random() * WINDOW_Y * 5);
				
				let dist = Math.sqrt(randX * randX + randY * randY);
				if (dist > 500){
					correctSpawn = true;
				}
			}
						
			game.zombies[i] = new Zombie(randX, randY, player.x,player.y);
		}
		this.interval = setInterval(this.update,20);
	},
	
	clear : function(){
		this.context.fillStyle = "rgb(0,150,50)";
		this.context.fillRect(0,0,WINDOW_X,WINDOW_Y);

	},
	
	update: function(){
		game.clear();
		game.score += 1;
		
		
		if (this.quitGame)
			return;
		
		//update and draw zombies
		for (let i = 0; i < game.zombies.length; i+=1){
			if (game.zombies[i].update()){
				game.zombies.splice(i,1);
				continue;
			}
			game.zombies[i].draw();
		}
		
		//update bullets
		for (let i = 0; i < game.bullets.length; i+=1){
			if (game.bullets[i].update()){
				game.bullets.splice(i,1);
			}
		}
		//update and draw the player
		player.update();
		player.draw();
		
		//check bullet collisions
		for (let i = 0; i < game.zombies.length; i+=1){
			let zombie = game.zombies[i];
			if (zombie.dead == false && game.onScreen(zombie.x,zombie.y,zombie.w,zombie.h))
				for (let j = 0; j < game.bullets.length; j+=1){
					if(game.bullets[j].collision(zombie.x,zombie.y)){
						game.zombies[i].dead = true;
						game.bullets.splice(j,1);
						break;
					}
				}
		}
		
		//check for zombie collision
		for (let i = 0; i < game.zombies.length; i+=1){
			if (game.zombies[i].dead == false){
				if (game.zombies[i].collision(player.x,player.y,player.w,player.h)){
					window.alert("GAME OVER: you got eaten");
					this.quitGame = true;
				}
			}
			
		}
		let buffer = 30;
		
		//check for out of bounds
		if (player.x < -buffer || player.x > WINDOW_X + buffer|| player.y < -buffer || player.y > WINDOW_Y + buffer){
			window.alert("GAME OVER: out of bounds");
			this.quitGame = true;
		}
		
		
		//render score display
		game.context.font = "30px Times";
		game.context.fillStyle = "yellow";
		game.context.fillText("Score: " + game.score, 0,WINDOW_Y);
	},
	onScreen: function(x,y,w,h){
		if (x + w < 0 || x > WINDOW_X)
			return false;
		if (y + h < 0 || y > WINDOW_Y)
			return false;
		return true;
	}
}

var animations = {
	SHOOTING_L : 1,
	SHOOTING_R: 2,
	SHOOTING_U: 3,
	SHOOTING_D: 4,
	WALKING_L: 5,
	WALKING_R: 6,
	WALKING_U: 7,
	WALKING_D: 8,
	IDLE_L: 9,
	IDLE_R: 10,
	IDLE_U: 11,
	IDLE_D: 12
}

const MIN_BULLET_DISTANCE = 20;
const BULLET_LIFETIME = 50;

class Bullet{
	constructor(x,y,dir){
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.lifetime = BULLET_LIFETIME;
	}
	
	update(){
		this.lifetime -= 1;
		if (this.lifetime <= 0){
			return true;
		}
		return false;
	}
	
	collision(x,y){
		// check collision on y axis
		if (this.dir == 90){
			let distX = Math.abs(this.x - x);
			if (distX < MIN_BULLET_DISTANCE && this.y > y){
				return true;
			}
		}
		if (this.dir == 270){
			let distX = Math.abs(this.x - x);
			if (distX < MIN_BULLET_DISTANCE && this.y < y){
				return true;
			}
		}
		//check collision on x axis
		if (this.dir == 0){
			let distY = Math.abs(this.y - y);
			if (distY < MIN_BULLET_DISTANCE && this.x < x){
				return true;
			}
		}
		if (this.dir == 180){
			let distY = Math.abs(this.y - y);
			if (distY < MIN_BULLET_DISTANCE && this.x > x){
				return true;
			}
		}
		return false;
	}
	
	
}

class Zombie {
	constructor(x,y,playerX,playerY){
		//for tracking the player
		this.playerX = playerX;
		this.playerY = playerY;
		
		this.x = x;
		this.y = y;
		this.w = ZOMBIE_DIMS;
		this.h = ZOMBIE_DIMS;
		this.speed = ZOMBIE_SPEED;
		this.dir = 0;
		
		//using same texture as player for now
		this.texture = new SpriteSheet("zombie",[13,3],1300,558);
		this.animationTime = 0.0;
		this.animationIndex = 0;
		this.animation = 0;
		this.walking = false;
		this.shooting = false;
		this.dead = false;
		this.lifetime = 1000; //frames before zombie deletes after death
	}
	
	update(){
		if (this.dead){
			this.lifetime -= 1;
			if (this.lifetime == 0){
				return true
			}
			return false
		}

		
		let distX = player.x - this.x;
		let distY = player.y - this.y;
		
		let absDistX = Math.abs(distX);
		let absDistY = Math.abs(distY);
		
		
		if (absDistX > absDistY){
			if(distX < 0){
				this.dir = 180;
				this.walking = true;
				this.x -= this.speed;
			} else {
				this.dir = 0;
				this.walking = true;
				this.x += this.speed;
			}
		} else {
			if (distY < 0){
				this.dir = 90;
				this.walking = true;
				this.y -= this.speed;
			} else{
				this.dir = 270;
				this.walking = true;
				this.y += this.speed;
			}
		}
		return false;
	}
	
	draw(){
		let animationData = this.calculateAnimation();
		let startTile = animationData[0];
		let numTiles = animationData[1];
		
		
		this.animationTime += 0.1; // animation speed
		this.animationIndex = startTile + Math.floor(this.animationTime % numTiles); 
				
		let spritesheet = this.texture;
		let dims = spritesheet.getTextureCoords(this.animationIndex);
		
		let context = game.canvas.getContext("2d");
		
		context.drawImage(document.getElementById(spritesheet.id),dims[0],dims[1],dims[2],dims[3],
				this.x,this.y,this.w,this.h);
	}
	
	calculateAnimation(){
		let tile = 0;
		let numTiles = 1;
		let oldAnimation = this.animation;
		
		if (this.dead)
			return [25,1];
		
		
		//shooting
		if (this.shooting == true){
			// all shooting animations have 2 frames (except one)
			numTiles = 2;
			switch (this.dir){
				case 0:
					this.animation = animations.SHOOTING_R;
					tile = 26;
					break;
				case 90:
					this.animation = animations.SHOOTING_U;
					tile = 32;
					numTiles = 1;
					break;
				case 180:
					this.animation = animations.SHOOTING_L;
					tile = 28;
					break;
				case 270:
					this.animation = animations.SHOOTING_D;
					tile = 30;
					break;
				default:
					break;
			}
			//override other animations
			return [tile,numTiles];
		}
		
		//idle
		if (this.walking == false){
			switch (this.dir){
				case 0:
					this.animation = animations.IDLE_R;
					tile = 3;
					break;
				case 90:
					this.animation = animations.IDLE_U;
					tile = 15;
					break;
				case 180:
					this.animation = animations.IDLE_L;
					tile = 9;
					break;
				case 270:
					this.animation = animations.IDLE_D;
					tile = 21;
					break;
				default:
					break;
			}
		}
		
		//walking
		if (this.walking == true){
			// all walking animations have 6 frames
			numTiles = 6;

			switch (this.dir){
				case 0:
					this.animation = animations.WALKING_R;
					tile = 1;
					break;
				case 90:
					this.animation = animations.WALKING_U;
					tile = 13;
					break;
				case 180:
					this.animation = animations.WALKING_L;
					tile = 7;
					break;
				case 270:
					this.animation = animations.WALKING_D;
					tile = 19;
					break;
				default:
					break;
			}
			
		} 
		
		if (oldAnimation != this.animation){
			this.animationTime = 0;
		}
		
		return [tile,numTiles];
	}
	
	collision(x,y,width,height){
		let distX = Math.abs(this.x - x);
		let distY = Math.abs(this.y - y);
		
		let minXDist = (width / 2) + (this.w / 2);
		let minYDist = (height / 2) + (this.h / 2);
		
		if (distX < minXDist && distY < minYDist){
			return true;
		}
		return false;
	}
}

// in a function, 'this' refers to the global object
// for a method in an object, 'this' refers to the object

function component(x,y,w,h,color){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.speed = 4;
	this.dir = 1;
	this.walking = false;
	this.shooting = false;
	
	//animation methods
	this.texture = new SpriteSheet("player", [13,3],1300,558);
	this.animationIndex = 1;
	this.animationTime = 0;
	this.animation = 0;
	this.animationDuration = -1; //a duration of -1 means there is no max duration
	
	this.update = function(){
		player.walking = false;		

		if (inputManager.a_key){
			player.dir = 180;
			player.x -= player.speed;
			player.walking = true;
			return;
		}
		if (inputManager.d_key){
			player.dir = 0;
			player.x += player.speed;
			player.walking = true;
			return;
		}
		if (inputManager.w_key){
			player.dir = 90;
			player.y -= player.speed;
			player.walking = true;
			return;
		}
		if (inputManager.s_key){
			player.dir = 270;
			player.y += player.speed;
			player.walking = true;
			return;
		}
	};
	
	this.draw = function(){
		//update animation
		let animationData = player.calculateAnimation();
		let numTiles = animationData[1];
		let startTile = animationData[0];
		
		
		player.animationTime += 0.1; // animation speed
		player.animationIndex = startTile + Math.floor(player.animationTime % numTiles); 
		
		//cancel the shooting animation after the second frame
		
				
		let spritesheet = player.texture;
		let dims = spritesheet.getTextureCoords(player.animationIndex);
		
		let context = game.canvas.getContext("2d");
		
		context.drawImage(document.getElementById(spritesheet.id),dims[0],dims[1],dims[2],dims[3],
				player.x,player.y,player.w,player.h);
		
		if (player.animationDuration > 0){
			if (player.animationTime > player.animationDuration){
				player.shooting = false;
				player.animationDuration = -1;
			}
		}
		
	};
	
	this.calculateAnimation = function(){
		let tile = 0;
		let numTiles = 1;
		let prevAnimation = player.animation;
		
		
		//shooting
		if (player.shooting == true){
			player.animationDuration = 4;
			// all shooting animations have 2 frames (except one)
			numTiles = 2;
			switch (player.dir){
				case 0:
					tile = 26;
					player.animation = animations.SHOOTING_R;
					break;
				case 90:
					tile = 32;
					numTiles = 1;
					player.animation = animations.SHOOTING_U;
					break;
				case 180:
					tile = 28;
					player.animation = animations.SHOOTING_L;
					break;
				case 270:
					tile = 30;
					player.animation = animations.SHOOTING_D;
					break;
				default:
					break;
			}
			//override other animations
			return [tile,numTiles];
		}
		
		//idle
		if (player.walking == false){
			switch (player.dir){
				case 0:
					player.animation = animations.IDLE_R;
					tile = 3;
					break;
				case 90:
					player.animation = animations.IDLE_U;
					tile = 15;
					break;
				case 180:
					player.animation = animations.IDLE_L;
					tile = 9;
					break;
				case 270:
					player.animation = animations.IDLE_D;
					tile = 21;
					break;
				default:
					break;
			}
		}
		
		//walking
		if (player.walking == true){
			// all walking animations have 6 frames
			numTiles = 6;

			switch (player.dir){
				case 0:
					tile = 1;
					player.animation = animations.WALKING_R;
					break;
				case 90:
					player.animation = animations.WALKING_U;
					tile = 13;
					break;
				case 180:
					player.animation = animations.WALKING_L;
					tile = 7;
					break;
				case 270:
					player.animation = animations.WALKING_D;
					tile = 19;
					break;
				default:
					break;
			}
			
		} 
		//reset the animation time if the animation changed
		if (prevAnimation != player.animation){
			player.animationTime = 0.0;
		}
		
		
		return [tile,numTiles];
	}
	
	this.fire = function(){
		let key = event.code;
		
		if (key == "Space"){
			player.shooting = true;
			document.getElementById("sound").load();
			document.getElementById("sound").play();
			
			game.bullets.push(new Bullet(player.x,player.y,player.dir));
		}
	}
}

var player = new component(0,0,40,40);

//*******************************************************************
//*******************************************************************

function start(){
	game.init();
	document.getElementById("submit_button").addEventListener("click",setVals,false);
}


function setVals() {
	let numZombies = document.getElementById("num_zombies").value;
	let zombieSpeed = document.getElementById("zombie_speed").value;

	if (numZombies != ""){
		NUM_ZOMBIES = parseInt(document.getElementById("num_zombies").value);		
	}
	if (zombieSpeed != ""){
		ZOMBIE_SPEED = parseFloat(document.getElementById("zombie_speed").value);
	}
	
	document.getElementById("submit_button").removeEventListener("click",setVals,false);

	game.play();
	
}

// only begin this script once the whole document has loaded
window.onload = start;