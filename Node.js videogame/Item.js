const Sprite = require("./Sprite.js");
const AudioEngine = require("./AudioEngine.js");
const MAX_INVENTORY = 4;

class Item extends Sprite{
	constructor(x,y,w,h,texturePath,name,soundFilePath){
		super(x,y,w,h,texturePath);
		this.name = name;
		this.soundFilePath = soundFilePath;
		this.uses = 1;
	}

	update(players){		
		for (let i = 0; i < players.length; i++){
			if (this.touching(players[i].sprite)){
				if (players[i].inventory.length < MAX_INVENTORY){
					players[i].collect(this);
					return true;
				}
			}			
		}

		return false;
	}

	use(player){
		//play the item's sound effect
		if (this.soundFilePath != "")
			AudioEngine.loadSound(this.soundFilePath,player.ownerCell);
		
		this.uses--;
		if (this.uses == 0)
			return true;
		return false;
	}
}

//***** GUN
const GUN_USES = 5;

class Gun extends Item{
	constructor(x,y,w,h,texturePath,name,soundFilePath){
		super(x,y,w,h,texturePath,name,soundFilePath);

		this.uses = GUN_USES;
	}

	use(player){
		player.fire();
		return super.use(player);
	}
}


//***** MEDKIT
const MEDKIT_USES = 1;
const HEALTH_BOOST = 15;

class MedKit extends Item{
	constructor(x,y,w,h,texturePath,name,soundFilePath){
		super(x,y,w,h,texturePath,name,soundFilePath);
		this.uses = MEDKIT_USES;
	}

	use(player){
		player.health += HEALTH_BOOST;
		return super.use(player);
	}
}

module.exports = {
	Gun,
	MedKit,
	Item
};
