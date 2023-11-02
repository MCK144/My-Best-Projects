const Hitbox = require("./Hitbox.js");

//the most basic rendering structure
class Sprite extends Hitbox{
	constructor(x,y,w,h,path){
		super(x,y,w,h);
		this.texturePath = path;
	}
}

class EntitySprite extends Sprite{
	constructor(x,y,w,h,path){
		super(x,y,w,h,path);
		
		//this variable is here because when an entity is keeping track of it's target's sprite, it 
		// needs to know when that sprite is dead 
		this.dead = false;
	}
}

module.exports = Sprite;
module.exports = EntitySprite;