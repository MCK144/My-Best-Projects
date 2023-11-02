const Entity = require("./Entity.js");

const CRIMINAL_SPEED = 2;
const CRIMINAL_ATTACK = 10;

const MIN_ATTACK_DISTANCE = 30;


class Criminal extends Entity{
	constructor(x,y,threatLevel){
		super(x,y);
		this.type = "criminal";
		this.speed = CRIMINAL_SPEED;
		this.texturePathExtension = "textures/citizen1/";


		this.attackDamage = CRIMINAL_ATTACK;
		//level 1 - criminal runs from player, otherwise walks
		//level 2 - criminal will attack player
		//****level 3 - criminal will attack 1 citizen, then run****
		//level 3 - criminal will attack all citizens
		//level 4 - criminal will attack everyone
		this.threatLevel = threatLevel;
		//copied from the citizen class, used for walking AI
		this.timer = 0;
		this.action = 0;

		this.target = null;
	}

	update(players = null,citizens = null,criminals = null){
		super.update();
		this.sprite.texturePath = this.texturePathExtension + Entity.textures[this.animationIndex];

		if (this.sprite.dead) return;
		
		//determine the action of this criminal
		switch(this.threatLevel){
			case 1:
				this.avoidPlayer(players);
				break;
			case 2:
				this.attackNearestPlayer(players);
				break;
			case 3:
				this.attackCitizens(citizens);
				break;
			default:
				this.attackAll(players,citizens);
		}
	}

	avoidPlayer(players){
		if (this.takingDamage) return;

		const MIN_X_DIST = 200;
		const MIN_Y_DIST = 200;

		//avoid the nearest player
		for (let i = 0; i < players.length; i++){
			let xDist = players[i].sprite.x - this.sprite.x;
			let yDist = players[i].sprite.y - this.sprite.y;

			let absXDist = Math.abs(xDist);
			let absYDist = Math.abs(yDist);

			//simpler than the pythagorean theorem
			if (absXDist <= MIN_X_DIST && absYDist <= MIN_Y_DIST){
				this.moveInDirection(xDist,yDist,-1,true);
				return;
			}

		}

		//walk if no player is near
		const CHANGE_DIR = 150;
		
		//change directions randomly 
		this.walking = false;

		this.timer--;
		if (this.timer <= 0){
			this.timer = CHANGE_DIR;
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
	
	attackNearestPlayer(players){
		if (players.length == 0){
			//this.threatLevel = 1;
			return;
		}

		const MIN_ATTACK_DISTANCE = 50;

		var data = this.findNearest(players);

		let closestPlayer = data[0];
		//return if no player found
		if (closestPlayer == null){
			this.threatLevel = 1;
			return;
		}
		let closestDistVec = data[1];
		let closestDist = data[2];

		//move towards player if the player is too far
		if (closestDist > MIN_ATTACK_DISTANCE){
			this.punching = false;
			this.moveInDirection(closestDistVec[0],closestDistVec[1],1);
		}
		//attack the player
		else{
			//just set the direction of the criminal
			this.moveInDirection(closestDistVec[0],closestDistVec[1],1,false);
			this.punching = true;
		}
		
	}
	
	attackCitizens(citizens){

		var data = this.findNearest(citizens);
		
		let closestCitizen = data[0];
		let closestDistVec = data[1];
		let closestDist = data[2];

		if (closestCitizen == null){
			this.threatLevel = 2;
			return;
		}

		//move towards target if the target is too far
		if (closestDist > MIN_ATTACK_DISTANCE){
			this.punching = false;
			this.moveInDirection(closestDistVec[0],closestDistVec[1],1);
		}
		//attack the target
		else{
			//just set the direction of the criminal
			this.moveInDirection(closestDistVec[0],closestDistVec[1],1,false);
			this.punching = true;
		}
	}

	attackAll(players,citizens){
		var playerData = this.findNearest(players);
		var citizenData = this.findNearest(citizens);

		let target = null;
		let distVec = null;
		let distance = null;
		
		//player and citizen were found
		if (playerData[0] != null && citizenData[0] != null){
			//the citizen is closer
			if (playerData[2] > citizenData[2]){
				target = citizenData[0];
				distVec = citizenData[1];
				distance = citizenData[2];
			}
			//the player is closer
			else {
				target = playerData[0];
				distVec = playerData[1];
				distance = playerData[2];
			}
		}
		//only player was found
		else if (citizenData[0] == null){
			target = playerData[0];
			distVec = playerData[1];
			distance = playerData[2];
		}
		//only the citizen was found
		else if (playerData[0] == null){
			target = citizenData[0];
			distVec = citizenData[1];
			distance = citizenData[2];
		}
		else{
			return;
		}

		//move towards target
		if (distance > MIN_ATTACK_DISTANCE){
			this.punching = false;
			this.moveInDirection(distVec[0],distVec[1],1);
		}
		//attack the target
		else{
			this.moveInDirection(distVec[0],distVec[1],1,false);
			this.punching = true;
		}
	}
}

module.exports = Criminal;