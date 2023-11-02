const Entity = require("./Entity.js");


const CITIZEN_SPEED = 1;

const texturePaths = ["citizen1","citizen2","citizen3","citizen4"];

class Citizen extends Entity{
	
	constructor(x,y){
		super(x,y);
		this.type = "citizen";
		this.speed = CITIZEN_SPEED;
		//the direction this citizen is moving, or whether he moves at all
		this.action = 0;
		this.timer = 0;
		
		let randCitizen = texturePaths[Math.floor(Math.random()*texturePaths.length)];
		this.texturePathExtension = "textures/" + randCitizen+"/";
	}

	update(players = null,citizens = null,criminals = null){
		super.update();
		this.sprite.texturePath = this.texturePathExtension + Entity.textures[this.animationIndex];


		if (this.sprite.dead) return;
		
		//walking AI
		if (this.target == null)
			this.walk();
		//fighting AI
		else
			this.attackTarget();		
	}
}

module.exports = Citizen;