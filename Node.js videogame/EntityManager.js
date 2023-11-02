const Grid = require("./Grid.js");
const BulletSpawner = require("./BulletSpawner.js");

const KILL_THREAT = 10;

class EntityManager{
	constructor(){
		//get a reference to the cells
		this.cells = Grid.cells;
		this.numCells = this.cells.length;
	}

	updateEntities(players,citizens,criminals){
		//update entities in a cell that a player is in
		for (let i = 0; i < players.length; i++){
			let cell = this.cells[players[i].ownerCell];
			
			//update the cell with a player
			this.updateCell(cell,players,citizens,criminals);

			//update the cells surrounding this one
			let cells = Grid.getSurroundingCells(cell.x,cell.y);
			for (let j = 0; j < cells.length; j++){
				this.updateCell(cells[j],players,citizens,criminals);
			}			
		}
		Grid.resetCells();
	}

	updateCell(cell,players,citizens,criminals){
		//avoid double updates
		if (cell.updated == true) return;
		
		cell.updated = true;
		
		let agents = cell.agents;
		let hitboxes = cell.hitboxes;
		let doors = cell.doors;
		let bullets = cell.bullets;
		
		let surroundingCells = Grid.getSurroundingCells(cell.x,cell.y); 

		
		//update the doors
		for (let i = 0; i< doors.length; i++ ){
			let door = doors[i];	
			door.update();
		}
		
		//update the bullets
		for (let i = 0; i < bullets.length; i++){
			let bullet = bullets[i];

			//collide bullet with all entities in the surrounding cells
			for (let j = 0; j < surroundingCells.length; j++){
				this.checkBulletCollisions(bullet,surroundingCells[j]);
			}
			this.checkBulletCollisions(bullet,cell);
			
			if (bullet.update()){
				Grid.removeBullet(bullet);
				BulletSpawner.destroyBullet(bullet);
			}
				
		}
		
		//update each agent in the cell
		for (let i = 0; i < agents.length; i++){
			let agent = agents[i];
			
			//update the agent
			agent.update(Grid,players,citizens,criminals);
			
			//check collisions between the agent and buildings
			for(let j = 0; j < hitboxes.length; j++){
				hitboxes[j].checkCollision(agent.sprite);
			}

			for (let j = 0; j< doors.length; j++ ){
				let door = doors[j];
			
				if (door.open == false){
					door.hitbox.checkCollision(agent.sprite);
					door.checkForAttack(agent);
				}
			}
			
		
			
			//the last agent in the cell doesn't need to update collisions with the other agents
			if (i == agents.length - 1) continue;
			
			//update collisions between agents
			agent.checkForAttack(agents,i+1,agents.length-1);
		}
	}
	
	checkBulletCollisions(bullet,cell){
		let agents = cell.agents;
		let hitboxes = cell.hitboxes;
		let doors = cell.doors;	
		
		if (bullet.lifetime == 0) return;
		
		//collision with entities
		for (let j = 0; j < agents.length; j++){
			let agent = agents[j];
			if (agent == bullet.owner || agent.sprite.dead)
				continue;
			if (bullet.collidesWith(agent.sprite)){
				//destroy the bullet
				bullet.lifetime = 0;
				//damage the entity
				agent.takeShot(bullet.damage);
				if (agent.type != "criminal")
					bullet.owner.threatLevel += 10;
				return;
			}		
		}
		//collision with doors
		for (let j = 0; j < doors.length; j++){
			let door = doors[j];
			if (bullet.collidesWith(door.hitbox)){
				bullet.lifetime = 0;
				return;
			}
		}
		//collision with walls
		for (let j = 0; j < hitboxes.length; j++){
			let hitbox = hitboxes[j];
			if (bullet.collidesWith(hitbox)){
				bullet.lifetime = 0;
				return;
			}
		}
	}
}

module.exports = EntityManager;