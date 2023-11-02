const EntitySprite = require("./Sprite.js");
const Hitbox = require("./Hitbox.js");
const AudioEngine = require("./AudioEngine.js");
const Grid = require("./Grid.js");

const WIDTH = 20;
const HEIGHT = 60;

const ATTACK_WIDTH = 30;
const ATTACK_HEIGHT = 30;

const START_HEALTH = 100;
const DAMAGE_COOLDOWN = 15;
const INVULNERABILITY_TIME = 20;
const MIN_ATTACK_DISTANCE = 50;

const CHANGE_DIR = 150; //time it takes to change direction

const KILL_THREAT = 10; //how much your threat level raises
const HIT_THREAT = 0.5;

const FRICTION = 1.1;

const SECONDS_TO_FRAMES = 60.0;
const WALK_TIME = 0.1 * SECONDS_TO_FRAMES;//12;
const PUNCH_TIME = 0.1 * SECONDS_TO_FRAMES;//4;
const DAMAGE_TIME = 0.6 * SECONDS_TO_FRAMES;//10;
const CLUB_TIME = 0.05 * SECONDS_TO_FRAMES;//4;


class Entity{
	static DEFAULT_ATTACK_FORCE = 10;
	static DEFAULT_ATTACK_DAMAGE = 5;
	
	static textures = [
	//Movement
	"idle_right.png",												//0
	"walk_right_1.png",										//1
	"walk_right_2.png",										//2
	"walk_right_3.png",										//3
	"walk_right_4.png",									//4
	"walk_right_5.png",										//5
	"walk_right_6.png",										//6
	"idle_left.png",										//7
	"walk_left_1.png",							//8
	"walk_left_2.png",							//9
	"walk_left_3.png",							//10
	"walk_left_4.png",							//11
	"walk_left_5.png",							//12
	"walk_left_6.png",							//13
	"idle_down.png",										//14
	"walk_down_1.png",									//15
	"walk_down_2.png",									//16
	"walk_down_3.png",									//17
	"walk_down_4.png",									//18
	"walk_down_5.png",									//19
	"walk_down_6.png",									//20
	"idle_up.png",											//21
	"walk_up_1.png",								//22
	"walk_up_2.png",                      //23
	"walk_up_3.png",                      //24
	"walk_up_4.png",                      //25
	"walk_up_5.png",                      //26
	"walk_up_6.png",                      //27
	"punch_left_1.png",                      //28
	"punch_left_2.png",                      //29
	"punch_left_3.png",                      //30
	"punch_right_1.png",                      //31
	"punch_right_2.png",                      //32
	"punch_right_3.png",                      //33
	"punch_up_1.png",                      //34
	"punch_up_2.png",                      //35
	"punch_up_3.png",                      //36
	"punch_up_4.png",                      //37
	"punch_up_5.png",                      //38
	"punch_down_1.png",                      //39
	"punch_down_2.png",                      //40
	"punch_down_3.png",                      //41
	"punch_down_4.png",                      //42
	"punch_down_5.png",                      //43
	// Combat
	"bat_right_1.png",                      //44
	"bat_right_2.png",                      //45
	"bat_right_3.png",                      //46
	"bat_right_4.png",                      //47
	"bat_right_5.png",                      //48
	"bat_left_1.png",                      //49
	"bat_left_2.png",                      //50
	"bat_left_3.png",                      //51
	"bat_left_4.png",                      //52
	"bat_left_5.png",                      //53
	"bat_up_1.png",                      //54
	"bat_up_2.png",                      //55
	"bat_up_3.png",                      //56
	"bat_up_4.png",                      //57
	"bat_up_5.png",                      //58
	"bat_down_1.png",                      //59
	"bat_down_2.png",                      //60
	"bat_down_3.png",                      //61
	"bat_down_4.png",                      //62
	"bat_down_5.png",                      //63
	// Damage
	"hit_left.png",                      //64
	"hit_right.png",                      //65
	"hit_down.png",                      //66
	"hit_up.png",                      //67
	"dead_left.png",					//68
	"dead_right.png"
];
	//Possibly move these to an animation file
	static animationStates = {
		IDLE : 0,
		WALKING_R: 1,
		WALKING_U: 2,
		WALKING_L: 3,
		WALKING_D: 4,
		PUNCH_R: 5,
		PUNCH_U: 6,
		PUNCH_L: 7,
		PUNCH_D: 8,
		TAKE_DAMAGE_L: 9,
		TAKE_DAMAGE_U: 10,
		TAKE_DAMAGE_R: 11,
		TAKE_DAMAGE_D: 12,
		DEAD: 13,
		CLUB_U: 14,
		CLUB_D: 15,
		CLUB_R: 16,
		CLUB_L: 17
	}
	
	constructor(x,y,useClubAnimation = false){
		//***game data***
		this.sprite = new EntitySprite(x,y,WIDTH,HEIGHT,"");
		this.attackBox = new Hitbox(0,0,ATTACK_WIDTH,ATTACK_HEIGHT,"red");
		this.speed = 0;
		this.walking = false;
		this.punching = false;
		this.health = START_HEALTH;
		this.changeDirectionTimer = 0;
		this.direction = 1;
		this.target = null; //the sprite of the last entity to attack this one
		this.threatLevel = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.type = "";
		this.ownedBullet = -1; //only in use by Player and SwatOfficer

		//***for spatial partitioning***
		this.ownerCell = -1; //keeps track of the index of the owner cell in the grid list of cells
		this.index = -1; //used for locating where in a cell's list of sprites this sprite can be found
		Grid.addAgent(this); //add the sprite to the grid
		
		//***combat***
		this.attackDamage = Entity.DEFAULT_ATTACK_DAMAGE;
		this.attackForce = Entity.DEFAULT_ATTACK_FORCE;
		this.takingDamage = false;
		this.damageTimer = 0; //time before the entity can attack again
		this.invulnerability = 0; //time before the entity can take damage again
		//this.dead is now stored in the sprite

		//***animation data***		
		this.prevAnimationState = Entity.animationStates["IDLE"];
		this.animationState = Entity.animationStates["IDLE"];
		this.time = 0; //the time the current animation has been running
		this.animationTime = 0; //the time each frame of an animation lasts
		this.numFrames = 0; // the amount of frames in an animation
		this.currFrame = 0;

		this.animationIndex = 0;
		this.useClubAnimation = useClubAnimation;
	}

	update(){
		this.setAnimation();
		//add forces
		this.sprite.x += this.velocityX;
		this.sprite.y += this.velocityY;
		this.velocityX /= FRICTION; //add friction
		this.velocityY /= FRICTION;
		
		if (this.sprite.dead){
			this.punching = false;
			this.attackBox.active = false;
			return;
		}
		
		this.updateAttackBox();
		this.updateDamage();

		//spatial partitioning
		this.updateGridPosition();
		
		
	}

	updateGridPosition(){
		//get whatever cell the sprite should be in
		let cell = Grid.getCellFromPosition(this.sprite.x,this.sprite.y);

		//transfer the sprite to a new cell if it moved
		if (cell.index != this.ownerCell){
			//remove the sprite from the old cell
			Grid.removeAgent(this);
			//re add it to the grid
			Grid.addAgentToCell(this,cell);
		}
	}
	
	//update the animation frames
	setAnimation(){
		//***this function must be defined by the child class***
		this.setAnimationProperties();

		//start a new animation
		if (this.animationState != this.prevAnimationState){
			this.time = 0;
			this.currFrame = 0;
		} 
		//continue the current animation
		else{
			this.time++;
			if (this.time == this.animationTime){
				this.time = 0;
				this.currFrame = (this.currFrame + 1) % this.numFrames;
			}
		}

		this.sprite.texturePath = Entity.textures[this.currFrame + this.startFrame];
		this.prevAnimationState = this.animationState;
		
		//temporary, used for the police to have unique textures
		this.animationIndex = this.currFrame + this.startFrame;
	}
	
	//determine which animation frames are being played
	setAnimationProperties(){
		//NOTE: default animations are stored here
		
		//dead animation
		if (this.sprite.dead){
			this.animationState = Entity.animationStates["DEAD"];
		}
		//taking damage
		else if (this.takingDamage){
			if (this.direction == 0)
				this.animationState = Entity.animationStates["TAKE_DAMAGE_R"];
			else if (this.direction == 1)
				this.animationState = Entity.animationStates["TAKE_DAMAGE_U"];
			else if (this.direction == 2)
				this.animationState = Entity.animationStates["TAKE_DAMAGE_L"];
			else if (this.direction == 3)
				this.animationState = Entity.animationStates["TAKE_DAMAGE_D"];
		}
		//punching
		else if (this.punching){
			if (this.useClubAnimation){
				if (this.direction == 0)
					this.animationState = Entity.animationStates["CLUB_R"];
				if (this.direction == 1)
					this.animationState = Entity.animationStates["CLUB_U"];
				if (this.direction == 2)
					this.animationState = Entity.animationStates["CLUB_L"];
				if (this.direction == 3)
					this.animationState = Entity.animationStates["CLUB_D"];
			}
			else{
				if (this.direction == 0)
					this.animationState = Entity.animationStates["PUNCH_R"];
				if (this.direction == 1)
					this.animationState = Entity.animationStates["PUNCH_U"];
				if (this.direction == 2)
					this.animationState = Entity.animationStates["PUNCH_L"];
				if (this.direction == 3)
					this.animationState = Entity.animationStates["PUNCH_D"];
			}
			
			
		}
		//walking animation
		else if (this.walking){
			if (this.direction == 0)
				this.animationState = Entity.animationStates["WALKING_R"];
			if (this.direction == 1)
				this.animationState = Entity.animationStates["WALKING_U"];
			if (this.direction == 2)
				this.animationState = Entity.animationStates["WALKING_L"];
			if (this.direction == 3)
				this.animationState = Entity.animationStates["WALKING_D"];
		}
		//idle animation
		else{
			this.animationState = Entity.animationStates["IDLE"];
		}
		
		switch(this.animationState){
			case Entity.animationStates["DEAD"]:
				this.numFrames = 1;
				this.animationTime = 10000;
				if (this.direction == 0 || this.direction == 1)
					this.startFrame = 69;
				else
					this.startFrame = 68;
				break;
			case Entity.animationStates["TAKE_DAMAGE_R"]:
				this.numFrames = 1;
				this.animationTime = DAMAGE_TIME;
				this.startFrame = 65;
				break;
			case Entity.animationStates["TAKE_DAMAGE_U"]:
				this.numFrames = 1;
				this.animationTime = DAMAGE_TIME;
				this.startFrame = 67;
				break;
			case Entity.animationStates["TAKE_DAMAGE_L"]:
				this.numFrames = 1;
				this.animationTime = DAMAGE_TIME;
				this.startFrame = 64;
				break;
			case Entity.animationStates["TAKE_DAMAGE_D"]:
				this.numFrames = 1;
				this.animationTime = DAMAGE_TIME;
				this.startFrame = 66;
				break;
			case Entity.animationStates["WALKING_R"]:
				this.numFrames = 6;
				this.animationTime = WALK_TIME;
				this.startFrame = 1;
				break;
			case Entity.animationStates["WALKING_U"]:
				this.numFrames = 6;
				this.animationTime = WALK_TIME;
				this.startFrame = 22;
				break;
			case Entity.animationStates["WALKING_L"]:
				this.numFrames = 6;
				this.animationTime = WALK_TIME;
				this.startFrame = 8;
				break;
			case Entity.animationStates["WALKING_D"]:
				this.numFrames = 6;
				this.animationTime = WALK_TIME;
				this.startFrame = 15;
				break;
			case Entity.animationStates["PUNCH_U"]:
				this.numFrames = 5;
				this.animationTime = PUNCH_TIME;
				this.startFrame = 34;
				break;
			case Entity.animationStates["PUNCH_R"]:
				this.numFrames = 3;
				this.animationTime = PUNCH_TIME;
				this.startFrame = 31;
				break;
			case Entity.animationStates["PUNCH_L"]:
				this.numFrames = 3;
				this.animationTime = PUNCH_TIME;
				this.startFrame = 28;
				break;
			case Entity.animationStates["PUNCH_D"]:
				this.numFrames = 5;
				this.animationTime = PUNCH_TIME;
				this.startFrame = 39;
				break;
			case Entity.animationStates["CLUB_R"]:
				this.numFrames = 5;
				this.animationTime = CLUB_TIME;
				this.startFrame = 44;
				break;
			case Entity.animationStates["CLUB_U"]:
				this.numFrames = 5;
				this.animationTime = CLUB_TIME;
				this.startFrame = 54;
				break;
			case Entity.animationStates["CLUB_L"]:
				this.numFrames = 5;
				this.animationTime = CLUB_TIME;
				this.startFrame = 49;
				break;
			case Entity.animationStates["CLUB_D"]:
				this.numFrames = 5;
				this.animationTime = CLUB_TIME;
				this.startFrame = 59;
				break;
		}
		if (this.animationState == Entity.animationStates["IDLE"]){
			this.numFrames = 1;
			this.animationTime = 10000;
			
			switch (this.direction){
				case 0:
					this.startFrame = 0;
					break;
				case 1:
					this.startFrame = 21;
					break;
				case 2:					
					this.startFrame = 7;
					break;
				case 3:
					this.startFrame = 14;
					break;
			}
		}
		
	}
	
	//move the attack box in the correct position
	updateAttackBox(){
		//update the attack box
		this.attackBox.active = false;
		if (this.takingDamage) return;
		
		if (this.punching){
			this.attackBox.active = true;
		}
		//set the position of the attack hitbox if the attack is active
		//whether the attack is active or not depends on the child class
		if(this.attackBox.active){
			if (this.direction == 0){
				this.attackBox.x = this.sprite.x + this.sprite.w;
				this.attackBox.y = this.sprite.y + this.sprite.h/2 - this.attackBox.h / 2;
			}
			else if (this.direction == 1){
				this.attackBox.x = this.sprite.x + this.sprite.w/2 - this.attackBox.w /2;
				this.attackBox.y = this.sprite.y - this.sprite.h/2;
			}
			else if (this.direction == 2){
				this.attackBox.x = this.sprite.x - this.sprite.w;
				this.attackBox.y = this.sprite.y + this.sprite.h/2 - this.attackBox.h / 2;
			}
			else if (this.direction == 3){
				this.attackBox.x = this.sprite.x + this.sprite.w/2 - this.attackBox.w /2;
				this.attackBox.y = this.sprite.y + this.sprite.h;
			}
			
		}
	}
	
	//update the damage timer and how long this entity is invulnerable
	updateDamage(){
		//update the damage timer
		this.damageTimer--;
		this.invulnerability--;
		
		if (this.damageTimer < 0){
			this.damageTimer = 0;
			this.takingDamage = false;
		}

		if (this.invulnerability <= 0){
			this.invulnerability = 0;
		}
	}

	rotateHitbox(){
		this.sprite.x -= this.sprite.w / 2;
		this.sprite.y += this.sprite.h / 2;
		let oldW = this.sprite.w;
		this.sprite.w = this.sprite.h;
		this.sprite.h = oldW;
	}

	//************************************************************
	// 			functions only being called from the child classes
	//************************************************************
	
	addForce(direction,power){
		switch(direction){
			case 0:
				this.velocityX = power;
				break;
			case 1:
				this.velocityY = -power;
				break;
			case 2:
				this.velocityX = -power;
				break;
			default:
				this.velocityY = power;
		}
	}
	
	//take a hit
	takeDamage(attackPower,attackForce,direction){
		//cannot take more damage until the timer reaches 0
		if (this.damageTimer > 0 || this.invulnerability > 0)
			return;

		this.invulnerability = DAMAGE_COOLDOWN + INVULNERABILITY_TIME;
		this.takingDamage = true;
		this.damageTimer = DAMAGE_COOLDOWN;
		this.health -= attackPower;
		this.addForce(direction,attackForce);
		
		
		if (this.health <= 0){
			AudioEngine.loadSound("oof.wav",this.ownerCell);
			this.sprite.dead = true;
			this.rotateHitbox();
			this.health = 0;
		}
		
		let randNum = Math.floor(Math.random() * 2);
		if (randNum == 0)
			AudioEngine.loadSound("punch.wav",this.ownerCell);
		else
			AudioEngine.loadSound("kick.wav",this.ownerCell);
		
		
	}

	//take a bullet
	takeShot(attackPower){
		if (this.sprite.dead == true) return;
		// the difference between takeShot and takeDamage is that takeShot can occur any time
		// while take damage can only occur if the timer is 0
		this.takingDamage = true;
		this.damageTimer = DAMAGE_COOLDOWN;
		this.health -= attackPower;
		
		if (this.health <= 0){
			this.sprite.dead = true;
			this.rotateHitbox();
			this.health = 0;
			//AudioEngine.loadSound("fart.mp3",this.ownerCell);
		}
	}

	//check for collisions with attack boxes
	checkForAttack(entities,first,last){
		if (this.sprite.dead == true) return;
		
		//check for collision with another attack hitbox
		for (let i = first; i <= last; i++){
			let entity = entities[i];

			if (entity.sprite.dead == true) continue;
			
			if (entity.attackBox.active && entity.attackBox.touching(this.sprite)){
				this.takeDamage(entity.attackDamage,entity.attackForce,entity.direction);
				//set the target for this entity to whoever hit it last
				this.target = entity.sprite;
				
				
				//increment threat level
				if (entity.type == "player" && (this.type == "police" || this.type == "citizen")){
					if (this.sprite.dead == true)
						entity.threatLevel += KILL_THREAT;
					else
						entity.threatLevel += HIT_THREAT;
				}
			}
			//give damage
			if (this.attackBox.active && this.attackBox.touching(entity.sprite)){
				entity.takeDamage(this.attackDamage,this.attackForce,this.direction);
				entity.target = this.sprite;
				
				//increment threat level
				if (this.type == "player" && (entity.type == "police" || entity.type == "citizen")){
					if (entity.sprite.dead)
						this.threatLevel += KILL_THREAT;
					else
						this.threatLevel += HIT_THREAT;
				}
			}
		}
	}
	
	moveInDirection(xDist,yDist,flip,move = true){
		let absXDist = Math.abs(xDist);
		let absYDist = Math.abs(yDist);

		if (flip == 1){
			if(absXDist > absYDist){
				if (xDist < 0){
					this.direction = 2;
				}
				else{
					this.direction = 0;
				}
			}
			else{
				if (yDist < 0){
					this.direction = 1;
				}
				else{
					this.direction = 3;
				}
			}
		} else{
			
			if(absXDist > absYDist){
				if (xDist < 0){
					this.direction = 0;
				}
				else{
					this.direction = 2;
				}
			}
			else{
				if (yDist < 0){
					this.direction = 3;
				}
				else{
					this.direction = 1;
				}
			}
		}
		
		
		if (!move) return;

		this.walking = true;
		switch(this.direction){
			case 0:
				this.sprite.x += this.speed;
				break;
			case 1:
				this.sprite.y -= this.speed;
				break;
			case 2:
				this.sprite.x -= this.speed;
				break;
			default:
				this.sprite.y += this.speed;
		}
	}

	findNearest(entities){
		let closestEntity = null;
		let closestDistVec = [0,0];
		let closestDist = 90000000;
		
		for (let i = 0; i < entities.length; i++){
			let entity = entities[i];
			if (entity.sprite.dead)
				continue;
			
			let xDist = entity.sprite.x - this.sprite.x;
			let yDist = entity.sprite.y - this.sprite.y;

			//calculate the distance vector
			let distVec = [xDist,yDist];
			let dist = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));

			if (dist < closestDist){
				closestEntity = entity;
				closestDist = dist;
				closestDistVec = distVec;
			}
		}

		return [closestEntity,closestDistVec,closestDist];
	}

	attackTarget(){
		if (this.target.dead == true){
			this.target = null;
			this.punching = false;
			return;
		}
		
		let xDist = this.target.x - this.sprite.x;
		let yDist = this.target.y - this.sprite.y;

		let distance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
		if (distance <= MIN_ATTACK_DISTANCE){
			this.punching = true;
			//make the AI face the player
			this.moveInDirection(xDist,yDist,1,false);
			return;
		}
		this.punching = false;
		//move towards the target in the X axis
		this.moveInDirection(xDist,yDist,1,true);
	}
	
	walk(){
		if (this.takingDamage) return;
		
		//change directions randomly 
		this.walking = false;

		this.changeDirectionTimer--;
		if (this.changeDirectionTimer <= 0){
			this.changeDirectionTimer = CHANGE_DIR;
			//reset the direction
			this.action = Math.floor(Math.random() * 10);
		}

		switch(this.action){
			case 0:
				this.direction = this.action;
				this.sprite.x += this.speed;
				this.walking = true;
				break;
			case 1:
				this.direction = this.action;
				this.sprite.y -= this.speed;
				this.walking = true;
				break;
			case 2:
				this.direction = this.action;
				this.sprite.x -= this.speed;
				this.walking = true;
				break;
			case 3:
				this.direction = this.action;
				this.sprite.y += this.speed;
				this.walking = true;
				break;				
		}
	}
}

module.exports = Entity;
