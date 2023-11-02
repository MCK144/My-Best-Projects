const Entity = require("./Entity.js");
const AudioEngine = require("./AudioEngine.js");
const Grid = require("./Grid.js");
const BulletSpawner = require("./BulletSpawner.js");


const PLAYER_SPEED = 3;
const ATTACK_DAMAGE = 20;

const KILL_GLOVE_DAMAGE = 200;
const SLAM_GLOVE_FORCE = 100;

const citizenTextures = ["citizen1/","citizen2/","citizen3/","citizen4/"];

const MAX_THREAT_FOR_DISGUISE = 15;

const GLOVE_EFFECT_TIME = 0.5 * 60.0;

class Player extends Entity{
	constructor(x,y,index){
		//game data
		super(x,y);
		this.texturePathExtension = "textures/"+citizenTextures[Math.floor(Math.random()*citizenTextures.length)];

		this.type = "player";
		this.speed = PLAYER_SPEED;
		this.attackDamage = ATTACK_DAMAGE;
		this.gloveEffectTimer = 0;

		//inventory data
		this.inventory = [];
		this.selectedItem = 0;
		this.ownedBullet = null;
		
		//player keyboard data
		this.playerIndex = index;
		this.keys = {
			w:false,
			a:false,
			s:false,
			d:false,
			space:false,
			one: false,
			two: false,
			three: false,
			four: false
		};
		//player mouse click
		this.click = false;
		this.mousePos = [0,0];
		this.threatLevel = 0;
		
		this.surroundingCells = [];

	}

	update(players = null,citizens = null,criminals = null){
		super.update();
		
		this.sprite.texturePath = this.texturePathExtension + Entity.textures[this.animationIndex];
		
		this.calculateSurroundingCellIndices();

		//remove disguise when player dies
		if (this.sprite.dead) {
			this.texturePathExtension = "textures/Thatman/";
			return;
		}
		
		//remove the player's disguise if his threat level is high enough
		if (this.useClubAnimation == false){
			if (this.threatLevel > MAX_THREAT_FOR_DISGUISE){
				this.useClubAnimation = true;
				this.texturePathExtension = "textures/Thatman/";
			}
		}
		
		this.updateInventory();
		this.movePlayer();
	}

	//this function determinds the indices of the cells surrounding the player so that
	// the play can play sounds from surrounding cells
	calculateSurroundingCellIndices(){		
		this.surroundingCells = [];
		
		let parentCell = Grid.cells[this.ownerCell];
		let cells = Grid.getSurroundingCells(parentCell.x,parentCell.y);
		
		for (let i = 0; i < cells.length; i++){
			this.surroundingCells[this.surroundingCells.length] = cells[i].index;
		}
	}

	updateInventory(){		
		//inventory selection
		if (this.keys['zero'])
			this.selectedItem = null;
		else if (this.keys['one'] && this.inventory.length > 0){
			this.selectedItem = 0;
		}
		else if (this.keys["two"] && this.inventory.length > 1){
			this.selectedItem = 1;
		}
		else if (this.keys["three"] && this.inventory.length > 2){
			this.selectedItem = 2;
		}
		else if (this.keys["four"] && this.inventory.length > 3){
			this.selectedItem = 3;
		}
		
		//update the glove effect timer
		if (this.gloveEffectTimer > 0){
			this.gloveEffectTimer -= 1;
		
			if (this.gloveEffectTimer == 0){
				//reset the attack and power values
				this.attackDamage = ATTACK_DAMAGE;
				this.attackForce = Entity.DEFAULT_ATTACK_FORCE;
				this.gloveEffectTimer = 0;
			}
		}
			
		
		if (this.inventory.length == 0 || this.selectedItem == null) return;
		
		let currentItem = this.inventory[this.selectedItem];	
		//use item (not gloves) on click
		if (this.click && currentItem.name != "slam_glove" && currentItem.name != "kill_glove"){
			this.useCurrentItem();
			this.punching = true;
		}

		this.click = false;
	}

	useCurrentItem(){
		let currentItem = this.inventory[this.selectedItem];
		if (currentItem.use(this)){
			this.inventory.splice(this.selectedItem,1);
			this.selectedItem--;
			if (this.selectedItem < 0){
				this.selectedItem = 0;
			}
		}	
	}

	fire(){
		let startX = this.sprite.x + this.sprite.w / 2;
		let startY = this.sprite.y + this.sprite.h / 2;

		//calculate the distance vector
		let dir = [0,0];
		dir[0] = this.mousePos[0] - startX;
		dir[1] = this.mousePos[1] - startY;

		//normalize the distance vector
		let distance = Math.sqrt(Math.pow(dir[0],2) + Math.pow(dir[1],2));
		if (distance == 0) return;
		dir[0] /= distance;
		dir[1] /= distance;
		this.ownedBullet = BulletSpawner.bulletCount;
		BulletSpawner.spawnBullet(startX,startY,dir,this);
		//AudioEngine.loadSound("gunshot.wav",this.ownerCell);
	}
	
	movePlayer(){
		this.walking = false;
		this.punching = false;
		
		if (this.keys['w']){
			this.sprite.y += -this.speed;
			this.walking = true;
			this.direction = 1;
		}
		else if (this.keys['a']){
			this.sprite.x += -this.speed;
			this.walking = true;
			this.direction = 2;
		}
		else if (this.keys['s']){
			this.sprite.y += this.speed;
			this.walking = true;
			this.direction = 3;
		}
		else if (this.keys['d']){
			this.sprite.x += this.speed;
			this.walking = true;
			this.direction = 0;
		}
		else if (this.keys["space"]){
			this.punching = true;
			
			//use the gloves if they are equipped
			if (this.inventory.length == 0 || this.selectedItem == null) return;
			
			let currentItem = this.inventory[this.selectedItem];
			if (this.gloveEffectTimer == 0 && (currentItem.name == "kill_glove" || currentItem.name == "slam_glove")){
				if (currentItem.name == "kill_glove")
					this.attackDamage = KILL_GLOVE_DAMAGE;
				else if (currentItem.name == "slam_glove"){
					this.attackDamage = 0;
					this.attackForce = SLAM_GLOVE_FORCE;
				}
				
				this.gloveEffectTimer = GLOVE_EFFECT_TIME;
				this.useCurrentItem();
			}
				
		}
	}
	
	collect(item){
		this.inventory[this.inventory.length] = item;
		this.selectedItem = this.inventory.length - 1;
	}
}

module.exports = Player;