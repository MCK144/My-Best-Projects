const Grid = require("./Grid.js");


const RADIUS = 5;
const LIFETIME = 30;
const SPEED = 20;
const DAMAGE = 100;

class Bullet {
	constructor(x,y,direction,owner,bulletIndex){
		this.x = x;
		this.y = y;
		this.r = RADIUS;
		this.direction = direction;

		this.owner = owner; //the entity that owns this bullet
		this.ownerCell = -1;
		this.index = -1;
		this.bulletIndex = bulletIndex;
		
		this.damage = DAMAGE;
		this.lifetime = LIFETIME;
		this.speed = SPEED;
	}

	update(){
		this.lifetime--;
		if (this.lifetime <= 0)
			return true;

		this.x += this.direction[0] * this.speed;
		this.y += this.direction[1] * this.speed;

		let cell = Grid.getCellFromPosition(this.x,this.y);

		if (cell.index != this.ownerCell){
			Grid.removeBullet(this);
			Grid.addBulletToCell(this,cell);
		}


		return false;
	}
	
	collidesWith(hitbox){
		//box-circle collision adapted from this site, with my own modification
		// https://www.jeffreythompson.org/collision-detection/circle-rect.php	

		let testX = null;
		let testY = null;
		
		if (this.x < hitbox.x)
			testX = hitbox.x;
		else if (this.x > hitbox.x + hitbox.w)
			testX = hitbox.x + hitbox.w;
		if (this.y < hitbox.y)
			testY = hitbox.y;
		else if (this.y > hitbox.y + hitbox.h)
			testY = hitbox.y + hitbox.h;
		
		//calculate the distance
		let xDist = 0;
		let yDist = 0;
		
		if (testX != null)
			xDist = this.x - testX;
		if (testY != null)
			yDist = this.y - testY;

		let dist = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
		
		if (dist <= this.r)
			return true;
		return false;
	}
}

module.exports = Bullet;