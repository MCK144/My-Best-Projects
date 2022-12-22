var canvas = document.getElementById("canvas");
var gameOverMessage = document.getElementById("gameOver");
var waveDisplay = document.getElementById("waveDisplay")
var waveCount = 0;

var context = canvas.getContext("2d");
const SCREEN_W = canvas.width;
const SCREEN_H = canvas.height;

const STAR_R = 2;
const STAR_COLOR = "white";

const NUM_STARS = 200;

class StarSpawner{
	constructor(){
		this.stars = [];
		
		for (let i = 0; i < NUM_STARS; i++){
			let randX = Math.floor(Math.random() * SCREEN_W);
			let randY = Math.floor(Math.random() * SCREEN_H);
			
			let star = new Star(randX,randY);
			this.stars[this.stars.length] = star;
		}
	}
	
	update(){
		for (let i = 0; i < NUM_STARS; i++){
			this.stars[i].update();
		}
	}
	
	render(){
		for (let i = 0; i < NUM_STARS; i++){
			this.stars[i].render();
		}
	}
}

class Star{
	constructor(x,y){
		this.x= x;
		this.y = y;
		this.r = STAR_R;
		this.color = STAR_COLOR;
		
		this.speed = 0.5;
	}
	
	update(){
		this.x -= this.speed;
		if (this.x <= 0 )
			this.x = SCREEN_W;
	}
	
	render(){
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.x,this.y,this.r,0,Math.PI*2);
		context.fill();
	}
}


class Sprite{
	constructor(x,y,w,h,texture){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.texture = texture;
	}
	
	render(){
		context.drawImage(this.texture,this.x,this.y,this.w,this.h);
	}
	
	collision(x,y,w,h){
		let xDist = Math.abs(this.x-x);
		let yDist = Math.abs(this.y-y);
		
		let minXDist = this.w / 2 + w / 2;
		let minYDist = this.h/2 + this.h/2;
		
		if (xDist <= minXDist && yDist <= minYDist){
			return true;
		}
		return false;
	}
}

var keys = {
	w : false,
	s : false,
	space : false
}

class AsteroidManager{
	constructor(){
		this.asteroids = [];
		this.count = 0;
		this.delay = 100;
		this.timer = this.delay;
	}
	
	update(){
		this.timer--;
		if (this.timer == 0){
			this.timer = this.delay;
			
			let randY = Math.floor(Math.random() * SCREEN_H);
			
			let a = new Asteroid(SCREEN_W,randY);
			this.asteroids[this.count] = a;
			this.count++;
		}
		
		for (let i = 0; i < this.count; i++){
			let destroy = this.asteroids[i].update();
			if (destroy){
				this.asteroids.splice(i,1);
				this.count--;
			}
		}
	}
	
	render(){
		for (let i = 0; i < this.count; i++){
			this.asteroids[i].render();
		}
	}
}

const ASTEROID_W = 100;
const ASTEROID_H = 80;

class Asteroid extends Sprite{
	constructor(x,y){
		let texture = new Image;
		texture.src = "Asteroid.png";
		super(x,y,ASTEROID_W,ASTEROID_H,texture);
		
		this.speed = 4;
		this.destroy = false;
	}
	
	update(){
		if (this.destroy == true) return true;
		
		this.x -= this.speed;
		
		if (this.x == -ASTEROID_W){
			return true;
		}
		
		return false;
	}
}

class BulletManager {
	constructor(){
		this.bullets = [];
		this.bulletCount = 0;
	}
	
	update(){
		for (let i = 0; i < this.bulletCount; i++){
			let destroy = this.bullets[i].update();
			
			if (destroy == true){
				this.bullets.splice(i,1);
				this.bulletCount--;
			}
				
		}
	}
	
	render(){
		for (let i = 0; i < this.bulletCount; i++){
			this.bullets[i].render();
		}
	}
	
	spawnBullet(x,y){
		let b = new Bullet(x,y);
		this.bullets[this.bulletCount] = b;
		this.bulletCount++;
		
		let sound = new Audio("LAZER.mp3");
		sound.play();
	}
}

const BULLET_W = 50;
const BULLET_H = 5;

class Bullet extends Sprite{
	constructor(x,y){
		super(x,y,BULLET_W,BULLET_H,null);
		
		this.speed = 8;
		this.color = "cyan";
	}
	
	render(){
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,this.w,this.h);
	}
	
	update(){
		this.x += this.speed;
		
		if (this.x > canvas.width){
			return true;
		}
		
		for (let i = 0; i < manager.asteroids.length; i++){
			let a = manager.asteroids[i];
			let collide = a.collision(this.x,this.y,this.w,this.h);
			
			if (collide == true){
				a.destroy = true;
				return true;
			}
				
		}
		
		
		return false;
	}
	
}


const TURRET_W = 100;
const TURRET_H = 100;
const MAX_FIRE_DELAY = 200;
const MIN_FIRE_DELAY = 100;

class Turret extends Sprite{
	constructor(x,y){
		let texture = new Image;
		texture.src = "Cannon.png";
		super(x,y,TURRET_W,TURRET_H,texture);
		
		this.fireTimer = Math.floor(Math.random()* MAX_FIRE_DELAY + MIN_FIRE_DELAY);
		this.dead = false;
	}
	
	update(){
		if (this.dead == true) return;
		
		this.fireTimer--;
		if (this.fireTimer <= 0){
			this.fireTimer = Math.floor(Math.random()* MAX_FIRE_DELAY + MIN_FIRE_DELAY);
			bulletManager.spawnBullet(this.x,this.y + this.h/2);
		}
		
		for (let i = 0; i < manager.count; i++){
			let asteroid = manager.asteroids[i];
			
			if (asteroid.collision(this.x,this.y,this.w,this.h)){
				this.dead = true;
				asteroid.destroy = true;
				return;
			}
		}
	}
	
	render(){
		if (this.dead == false)
			super.render();
	}
}

const PLAYER_W = 60;
const PLAYER_H = 30;
const FIRE_DELAY = 30;

class Player extends Sprite{
	constructor(x,y){
		let texture = new Image;
		texture.src = "player.png";
		
		super(x,y,PLAYER_W,PLAYER_H,texture);
		
		this.speed = 4;
		this.fireCooldown = 0;
		this.dead = false;
	}
	
	update(){
		if (this.dead) return;
		
		this.fireCooldown--;
		if(this.fireCooldown < 0) this.fireCooldown = 0;
		
		if (keys["w"])
			this.y -= this.speed;
		if (keys["s"])
			this.y += this.speed;
		if (keys["space"] && this.fireCooldown == 0){
			bulletManager.spawnBullet(this.x + this.w,this.y + this.h/2);
			this.fireCooldown = FIRE_DELAY;
		}
		
		
		for (let i = 0; i < manager.asteroids.length; i++){
			let a = manager.asteroids[i];
			let collide = a.collision(this.x,this.y,this.w,this.h);
			
			if (collide == true){
				this.dead = true;
				gameOverMessage.innerHTML = "GAME OVER";
			}
				
		}
	}
	
}

var player = new Player(300,240);
var manager = new AsteroidManager();
var bulletManager = new BulletManager();
var starManager = new StarSpawner();

var t1 = new Turret(0,25);
var t2 = new Turret(0,150);
var t3 = new Turret(0,275);
var t4 = new Turret(0,400);

updateWave();

function updateWave(){
	if (manager.delay <= 10){
		waveDisplay.innerHTML = "FINAL WAVE";
		return;
	}
	manager.delay -= 10;
	waveCount++;
	waveDisplay.innerHTML = waveCount;
	console.log("WAVE UPDATE");
	setTimeout(updateWave,15000);
}

function update(){
	player.update();
	manager.update();
	bulletManager.update();
	starManager.update();
	t1.update();
	t2.update();
	t3.update();
	t4.update();
}

function render(){
	context.fillStyle = "black";
	context.fillRect(0,0,SCREEN_W,SCREEN_H);
	
	starManager.render();
	if (player.dead == false)
		player.render();
	manager.render();
	bulletManager.render();
	t1.render();
	t2.render();
	t3.render();
	t4.render();
}

function play(){
	update();
	render();
}

setInterval(play,1000/60);

window.addEventListener("keydown",function(e){
	let key = e.key;
	
	if (key == "w")
		keys["w"] = true;
	if (key == "s")
		keys["s"] = true;
	if (key == " ")
		keys["space"] = true;
});

window.addEventListener("keyup",function(e){
	let key = e.key;
	
	if (key == "w")
		keys["w"] = false;
	if (key == "s")
		keys["s"] = false;
	if (key == " ")
		keys["space"] = false;
});




//add bullet class
//add bullet manager
//add fire timer so player can't spam
//add collision function to the sprite
//have player die when it touches bullet
//game over message
//add updateWave function
//keep player in game
//spawn stars