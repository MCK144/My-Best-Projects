//the most basic rendering structure

class Hitbox{
	constructor(x,y,w,h,color = "brown"){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = color;

		//useful for collision detection
		this.active = false;
	}

	//tests if touching 'hitbox'
	touching(hitbox){
		let centerX = this.x + this.w / 2;
		let centerY = this.y + this.h / 2;
		
		let hitboxCenterX = hitbox.x + hitbox.w / 2;
		let hitboxCenterY = hitbox.y + hitbox.h / 2;
		
		
		let xDist = Math.abs(centerX - hitboxCenterX);
		let yDist = Math.abs(centerY - hitboxCenterY);
		if (xDist <= hitbox.w / 2 + this.w/2 && yDist <= hitbox.h/2 + this.h/2){
			return true;
		}
		return false;
	}

	//moves 'hitbox' if touching
	checkCollision(hitbox,moveThis = false){
		
		let maxXDist = this.w / 2 + hitbox.w / 2;
		let maxYDist = this.h / 2 + hitbox.h / 2;
		
		let xDist = (hitbox.x + hitbox.w / 2) - (this.x + this.w / 2);
		let yDist = (hitbox.y + hitbox.h / 2) - (this.y + this.h / 2);
		let absXDist = Math.abs(xDist);
		let absYDist = Math.abs(yDist);

		let xDepth = maxXDist - absXDist;
		let yDepth = maxYDist - absYDist;

		//end the function early if no collision occurrs
		if (xDepth < 0 || yDepth < 0)
			return false;

		//if the x collision depth is greater, move the hitboxes along the x axis
		if (Math.max(xDepth,0.0) < Math.max(yDepth,0.0)){
			if (xDist < 0){				
				//move either both hitboxes or just the other based on moveThis
				hitbox.x -= xDepth / 2 - moveThis * xDepth / 2;
				this.x += moveThis * xDepth / 2;
			}
			else{
				hitbox.x += xDepth / 2 + moveThis * xDepth / 2;
				this.x -= moveThis * xDepth / 2;
			}
		}
		else{
			if (yDist < 0){				
				hitbox.y -= yDepth / 2 - moveThis * yDepth / 2;
				this.y += moveThis * yDepth / 2;
			}
			else{
				hitbox.y += yDepth / 2 + moveThis * yDepth /2;
				this.y -= moveThis * yDepth / 2; // I flipped the sign
			}
		}

		return true;
	}
}

module.exports = Hitbox;



/*
checkCollision(){
	let maxXDist = this.w / 2 + hitbox.w / 2;
	let maxYDist = this.h / 2 + hitbox.h / 2;
	
	let xDist = (hitbox.x + hitbox.w / 2) - (this.x + this.w / 2);
	let yDist = (hitbox.y + hitbox.h / 2) - (this.y + this.h / 2);
	let absXDist = Math.abs(xDist);
	let absYDist = Math.abs(yDist);

	let xDepth = maxXDist - absXDist;
	let yDepth = maxYDist - absYDist;

	//end the function early if no collision occurrs
	if (xDepth < 0 || yDepth < 0)
		return false;

	//if the x collision depth is greater, move the hitboxes along the x axis
	if (Math.max(xDepth,0.0) < Math.max(yDepth,0.0)){
		if (xDist < 0){				
			//move either both hitboxes or just the other based on moveThis
			hitbox.x -= xDepth / 2 - moveThis * xDepth / 2;
			this.x += moveThis * xDepth / 2;
		}
		else{
			hitbox.x += xDepth / 2 + moveThis * xDepth / 2;
			this.x -= moveThis * xDepth / 2;
		}
	}
	else{
		if (yDist < 0){				
			hitbox.y -= yDepth / 2 - moveThis * yDepth / 2;
			this.y += moveThis * yDepth / 2;
		}
		else{
			hitbox.y += yDepth / 2 + moveThis * yDepth /2;
			this.y += moveThis * yDepth / 2;
		}
	}

	return true;
}
*/