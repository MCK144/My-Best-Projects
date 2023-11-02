const Sprite = require("./Sprite.js");
const AudioEngine = require("./AudioEngine.js");

const DAMAGE_COOLDOWN = 0.75;
const SECONDS_TO_FRAMES = 60;

const closedDoorTexture = "textures/City/door.png";
const openDoorTexture = "textures/City/door_open.png";

class Door extends Sprite{
	constructor(x,y,w,h,hitbox){
		super(x,y,w,h,closedDoorTexture);
		this.health = 20;
		this.damageTimer = 0;
		this.open = false;
		this.hitbox = hitbox;
	}

	update(){
		this.damageTimer -= 1;
		if (this.damageTimer < 0) this.damageTimer = 0;
	}
	
	checkForAttack(agent){
		if (agent.attackBox.active && agent.attackBox.touching(this.hitbox))
			this.takeDamage(agent.attackDamage);		
	}
	
	takeDamage(attack){		
		//cannot take more damage until the timer reaches 0
		if (this.damageTimer > 0)
			return;

		this.health -= attack;
		AudioEngine.loadSound("break.mp3",this.hitbox.ownerCell);

		if (this.health <= 0){
			this.open = true;
			this.texturePath = openDoorTexture;
			return;
		}
		this.damageTimer = DAMAGE_COOLDOWN * SECONDS_TO_FRAMES;
	}
}

module.exports = Door;