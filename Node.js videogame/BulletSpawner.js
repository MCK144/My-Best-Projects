const Bullet = require("./Bullet.js");
const Grid = require("./Grid.js");

class BulletSpawner{
	static bulletCount = 0;
	static bullets = [];
	
	static spawnBullet(x,y,direction,owner){
		let bullet = new Bullet(x,y,direction,owner,BulletSpawner.bulletCount);
		BulletSpawner.bullets.push(bullet);
		Grid.addBullet(bullet);
		BulletSpawner.bulletCount++;
	}
	
	static destroyBullet(bullet){
		let totalBullets = BulletSpawner.bulletCount;
		
		//remove the last bullet in the list
		if (bullet.bulletIndex == totalBullets-1)
			BulletSpawner.bullets.pop();
		//swap the deleted bullet with the last bullet in the list
		else{
			let lastBullet = BulletSpawner.bullets.pop();
			lastBullet.bulletIndex = bullet.bulletIndex;
			BulletSpawner.bullets[bullet.bulletIndex] = lastBullet;
		}
		BulletSpawner.bulletCount -= 1;
	}
	
}

module.exports = BulletSpawner;