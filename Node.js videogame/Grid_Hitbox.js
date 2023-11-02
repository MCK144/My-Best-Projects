//a child class of Hitbox, but contains methods for spatial partitioning

const Hitbox = require("./Hitbox.js");

class Grid_Hitbox extends Hitbox{
	constructor(x,y,w,h,color = "rgb(31,31,31)"){
		super(x,y,w,h,color);
		this.ownerCell = -1;
	}

}

module.exports = Grid_Hitbox;