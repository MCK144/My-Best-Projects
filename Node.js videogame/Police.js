const Entity = require("./Entity.js");
const AudioEngine = require("./AudioEngine.js");
const Grid = require("./Grid.js");
const BulletSpawner = require("./BulletSpawner.js");

const POLICE_SPEED = 3;

var texturePathExtensions = ["cop1","cop2"];

class Police extends Entity{
  static states = {PATROL: 1, ATTACK: 2};
  
  constructor(x,y){
    super(x,y,true);
	this.texturePathExtension = "textures/"+texturePathExtensions[Math.floor(Math.random()*2)]+"/";
	this.type = "police";
    this.speed = POLICE_SPEED;
    this.state= Police.states.PATROL;
  }

  update(players = null,citizens = null,criminals = null){
	super.update();
	//reset the texture path
	this.sprite.texturePath = this.texturePathExtension + Entity.textures[this.animationIndex];
	
	if (this.sprite.dead == true) return;

	this.locateNearestCriminal();

	if (this.target == null)
		this.state = Police.states.PATROL;
	else{
		if (this.target.dead == true){
			this.target = null;
			this.state = Police.states.PATROL;
		}
		else
			this.state = Police.states.ATTACK;
	}
    switch(this.state){
      case Police.states.ATTACK:
		this.attackTarget();
        break;
      default:
		this.walk();
    }
  }
  
  locateNearestCriminal(){
	
	if (this.ownerCell == -1) return;
	if (this.target != null)  return;//the police have to finish hunting their current target before switching to another
	
    let cell = Grid.cells[this.ownerCell];
	
	let agents = cell.agents;
	
	let maxThreat = 0;
	
	for (let i = 0; i < agents.length; i++){
		let agent = agents[i];
		if (agent.sprite.dead == true || agent == this) continue;
		
		if (agent.threatLevel > maxThreat){
			this.target = agent.sprite;
			maxThreat = agent.threatLevel;
		}
	}
  }
 
}


const GUN_COOLDOWN = 100;
const FIRE_DISTANCE = 300;

class SwatOfficer extends Police{
	constructor(x,y){
		super(x,y);
		this.texturePathExtension = "textures/swat_officer/";
		this.fireCooldown = 0;
		this.ownedBullet = null;
	}
	
	update(players = null,citizens = null,criminals = null){
		this.fireCooldown -= 1;
		if (this.fireCooldown < 0) 
			this.fireCooldown = 0;
		
		super.update(players,citizens,criminals);
	}
	
	attackTarget(){
		if (this.target.dead == true){
			this.target = null;
			return;
		}
		let centerX = this.sprite.x + this.sprite.w / 2;
		let centerY = this.sprite.y + this.sprite.h / 2;
		
		let xDist = this.target.x + this.target.w / 2 - centerX;
		let yDist = this.target.y + this.target.h / 2 - centerY;

		let distance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
		if (distance <= FIRE_DISTANCE){
			this.walking = false;
			if (this.fireCooldown == 0){
				this.fireCooldown = GUN_COOLDOWN;
				
				if (distance == 0) return;
				AudioEngine.loadSound("gunshot.wav",this.ownerCell);
				
				this.ownedBullet = BulletSpawner.bulletCount;
				BulletSpawner.spawnBullet(centerX,centerY,[xDist / distance,yDist / distance],this);
			}
			this.moveInDirection(xDist,yDist,1,false);
			return;
		}
		//move towards the target in the X axis
		this.moveInDirection(xDist,yDist,1,true);
	}
}


module.exports = {Police,SwatOfficer};