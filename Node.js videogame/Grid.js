class Cell{
	//used to assign an index to each cell
	static count = 0;
	
	constructor(numXCells,numYCells){
		this.hitboxes = [];
		this.agents = [];
		this.doors = [];
		this.bullets = [];
		
		this.index = Cell.count; 		//the index of the cell in the grid list of cells
		Cell.count +=1;
		//calculate the position of the cell in the list as if the list was 2D
		this.x = this.index % numXCells;
		this.y = Math.floor(this.index / numXCells);
		
		this.updated = false; //keeps track of if the entities in this cell have been updated
	}
} 

class Grid{
	static width = null;
	static height = null;
	static cells = [];
	static cellSize = null;
		
	//we round up just so that all the world space is covered
	static numXCells = null;
	static numYCells = null;
	
	static totalCells = null;
	
	static initialize(width,height,cellSize){
		Grid.width = width;
		Grid.height = height;
		Grid.cellSize = cellSize;
		
		//we round up just so that all the world space is covered
		Grid.numXCells = Math.ceil(width / Grid.cellSize);
		Grid.numYCells = Math.ceil(height / Grid.cellSize);
		
		Grid.totalCells = Grid.numXCells * Grid.numYCells;

		//allocate the array of cells
		Grid.cells = new Array(Grid.totalCells);
		for (let i = 0; i < Grid.totalCells; i++) { 
			Grid.cells[i] = new Cell(Grid.numXCells,Grid.numYCells);
		}
		
	}

	//returns a list of cells surrounding the specified cell position
	static getSurroundingCells(x,y){
		let cells = [];

		//a nested for loop, but it iterates 8 times max
		for (let i = -1; i <= 1; i++){
			for (let j = -1; j <= 1; j++){
				let cellX = x + j;
				let cellY = y + i;
				//keep from going out of bounds
				if (cellX < 0 || cellX > Grid.numXCells-1 || cellY < 0 || cellY > this.numYCells-1) continue;
				//don't return the center cell
				if (i == 0 && j == 0)		continue;
				//add the cell to the list
				cells[cells.length] = Grid.getCellFromGrid(cellX,cellY);
			}
		}

		return cells;
		
	}
	
	//get a cell from the grid
	static getCellFromGrid(x,y){
		if (x < 0) x = 0;
		if (x > Grid.numXCells) x = Grid.numXCells;
		if (y < 0) y = 0;
		if (y > Grid.numYCells) y = Grid.numYCells;
		// a trick to treat a 1D array like a 2D array
		return Grid.cells[y * Grid.numXCells + x];
	}

	//get a cell based on the world position 
	static getCellFromPosition(x,y){
		// if the position is outside the world, just return the first cell or last cell
		if (x < 0 || y < 0) return Grid.cells[0];			
		if (y >= Grid.height || x >= Grid.width) return Grid.cells[Grid.totalCells - 1];

		let cellX = Math.floor(x / Grid.cellSize);
		let cellY = Math.floor(y / Grid.cellSize);

		let cell = Grid.getCellFromGrid(cellX,cellY);
		
		return cell;
	}
	
	static resetCells() {
		Grid.cells.forEach(function(cell,index) { cell.updated = false; });
	}
	
	//*********************************
	//           For entities
	//*********************************
	static addAgent(agent){
		let cell = Grid.getCellFromPosition(agent.sprite.x,agent.sprite.y);

		//add the sprite to the cell's list of sprites
		let numAgents = cell.agents.length;
		cell.agents[numAgents] = agent;

		//allow the agent to point back to it's owner cell
		agent.ownerCell = cell.index;
		agent.index = numAgents;
	}

	static addAgentToCell(agent,cell){
		//add the sprite to the cell's list of sprites
		let numAgents = cell.agents.length;
		cell.agents[numAgents] = agent;
		agent.ownerCell = cell.index;

		agent.index = numAgents;
	}

	static removeAgent(agent){
		//get the sprite's position in the owner cell's list
		let agentIndex = agent.index;
		let cellIndex = agent.ownerCell;
		let cell = Grid.cells[cellIndex];
		let numAgents = cell.agents.length;

		//if the cell only had one sprite, or if the agent is last in the list, then remove it		
		if (agentIndex == numAgents - 1){
			cell.agents.splice(agentIndex,1);
		}
		//if the cell has multiple sprites, swap the sprite to be removed with the last
		// sprite in the cell's list. That way, we only have to reassign the index for that one sprite
		else{
			//swap the sprite with the last one the cell owns
			cell.agents[agentIndex] = cell.agents[numAgents-1];
			//recalculate the agent's index
			cell.agents[agentIndex].index = agentIndex;
			//remove the last sprite the cell owns
			cell.agents.splice(numAgents-1,1);
		}
		
		agent.index = -1;
		agent.ownerCell = -1;
	}
	
	//*********************************
	//           For bullets
	//*********************************
	
	static addBullet(bullet){
		let cell = Grid.getCellFromPosition(bullet.x,bullet.y);
		let numBullets = cell.bullets.length;
		cell.bullets[numBullets] = bullet;

		//allow the agent to point back to it's owner cell
		bullet.ownerCell = cell.index;
		bullet.index = numBullets;
	}
	
	static addBulletToCell(bullet,cell){
		//add the sprite to the cell's list of sprites
		let numBullets = cell.bullets.length;
		cell.bullets[numBullets] = bullet;
		bullet.ownerCell = cell.index;

		bullet.index = numBullets;
	}
	
	static removeBullet(bullet){
		//get the sprite's position in the owner cell's list
		let bulletIndex = bullet.index;
		let cellIndex = bullet.ownerCell;
		let cell = Grid.cells[cellIndex];
		let numBullets = cell.bullets.length;

			
		if (bulletIndex == numBullets - 1)
			cell.bullets.splice(bulletIndex,1);
		else{
			cell.bullets[bulletIndex] = cell.bullets[numBullets-1];
			cell.bullets[bulletIndex].index = bulletIndex;
			cell.bullets.splice(numBullets-1,1);
		}
		
		bullet.index = -1;
		bullet.ownerCell = -1;
	}
	
	//*********************************
	//           For hitboxes and doors
	//*********************************
	static addHitbox(hitbox){
		let cell = Grid.getCellFromPosition(hitbox.x,hitbox.y);
		let numHitboxes = cell.hitboxes.length;
		cell.hitboxes[numHitboxes] = hitbox;
		hitbox.ownerCell = cell.index;
	}

	static addDoor(door){
		let cell = Grid.getCellFromPosition(door.hitbox.x,door.hitbox.y);
		let numDoors = cell.doors.length;
		cell.doors[numDoors] = door;
		door.hitbox.ownerCell = cell.index;
	}
}

module.exports = Grid;










/*
class Cell{
	//used to assign an index to each cell
	static count = 0;
	
	constructor(numXCells,numYCells){
		this.hitboxes = [];
		this.agents = [];
		this.doors = [];
		this.bullets = [];
		
		this.index = Cell.count; 		//the index of the cell in the grid list of cells
		Cell.count +=1;
		//calculate the position of the cell in the list as if the list was 2D
		this.x = this.index % numXCells;
		this.y = Math.floor(this.index / numXCells);
		
		this.updated = false; //keeps track of if the entities in this cell have been updated
	}
} 

class Grid{
	
	
	constructor(width,height,cellSize){
		this.width = width;
		this.height = height;
		this.cells = [];
		this.cellSize = cellSize;
		
		//we round up just so that all the world space is covered
		this.numXCells = Math.ceil(width / this.cellSize);
		this.numYCells = Math.ceil(height / this.cellSize);
		
		this.totalCells = this.numXCells * this.numYCells;

		//allocate the array of cells
		this.cells = new Array(this.totalCells);
		for (let i = 0; i < this.totalCells; i++) { 
			this.cells[i] = new Cell(this.numXCells,this.numYCells);
		}
		
	}

	//returns a list of cells surrounding the specified cell position
	getSurroundingCells(x,y){
		let cells = [];

		//a nested for loop, but it iterates 8 times max
		for (let i = -1; i <= 1; i++){
			for (let j = -1; j <= 1; j++){
				let cellX = x + j;
				let cellY = y + i;
				//keep from going out of bounds
				if (cellX < 0 || cellX > this.numXCells-1 || cellY < 0 || cellY > this.numYCells-1) continue;
				//don't return the center cell
				if (i == 0 && j == 0)		continue;
				//add the cell to the list
				cells[cells.length] = this.getCellFromGrid(cellX,cellY);
			}
		}

		return cells;
		
	}
	
	//get a cell from the grid
	getCellFromGrid(x,y){
		if (x < 0) x = 0;
		if (x > this.numXCells) x = this.numXCells;
		if (y < 0) y = 0;
		if (y > this.numYCells) y = this.numYCells;
		// a trick to treat a 1D array like a 2D array
		return this.cells[y * this.numXCells + x];
	}

	//get a cell based on the world position 
	getCellFromPosition(x,y){
		// if the position is outside the world, just return the first cell or last cell
		if (x < 0 || y < 0) return this.cells[0];			
		if (y >= this.height || x >= this.width) return this.cells[this.totalCells - 1];

		let cellX = Math.floor(x / this.cellSize);
		let cellY = Math.floor(y / this.cellSize);

		let cell = this.getCellFromGrid(cellX,cellY);
		
		return cell;
	}
	
	resetCells() {
		this.cells.forEach(function(cell,index) { cell.updated = false; });
	}
	
	//*********************************
	//           For entities
	//*********************************
	addAgent(agent){
		let cell = this.getCellFromPosition(agent.sprite.x,agent.sprite.y);

		//add the sprite to the cell's list of sprites
		let numAgents = cell.agents.length;
		cell.agents[numAgents] = agent;

		//allow the agent to point back to it's owner cell
		agent.ownerCell = cell.index;
		agent.index = numAgents;
	}

	addAgentToCell(agent,cell){
		//add the sprite to the cell's list of sprites
		let numAgents = cell.agents.length;
		cell.agents[numAgents] = agent;
		agent.ownerCell = cell.index;

		agent.index = numAgents;
	}

	removeAgent(agent){
		//get the sprite's position in the owner cell's list
		let agentIndex = agent.index;
		let cellIndex = agent.ownerCell;
		let cell = this.cells[cellIndex];
		let numAgents = cell.agents.length;

		//if the cell only had one sprite, or if the agent is last in the list, then remove it		
		if (agentIndex == numAgents - 1){
			cell.agents.splice(agentIndex,1);
		}
		//if the cell has multiple sprites, swap the sprite to be removed with the last
		// sprite in the cell's list. That way, we only have to reassign the index for that one sprite
		else{
			//swap the sprite with the last one the cell owns
			cell.agents[agentIndex] = cell.agents[numAgents-1];
			//recalculate the agent's index
			cell.agents[agentIndex].index = agentIndex;
			//remove the last sprite the cell owns
			cell.agents.splice(numAgents-1,1);
		}
		
		agent.index = -1;
		agent.ownerCell = -1;
	}
	
	//*********************************
	//           For bullets
	//*********************************
	addBullet(bullet){
		let cell = this.getCellFromPosition(bullet.x,bullet.y);
		let numBullets = cell.bullets.length;
		cell.bullets[numBullets] = bullet;

		//allow the agent to point back to it's owner cell
		bullet.ownerCell = cell.index;
		bullet.index = numAgents;
	}
	
	addBulletToCell(bullet,cell){
		//add the sprite to the cell's list of sprites
		let numBullets = cell.bullets.length;
		cell.bullets[numBullets] = bullet;
		bullet.ownerCell = cell.index;

		bullet.index = numBullets;
	}
	
	removeBullet(bullet){
		//get the sprite's position in the owner cell's list
		let bulletIndex = bullet.index;
		let cellIndex = bullet.ownerCell;
		let cell = this.cells[cellIndex];
		let numBullets = cell.bullets.length;

			
		if (bulletIndex == numBullets - 1)
			cell.agents.splice(bulletIndex,1);
		else{
			cell.bullets[bulletIndex] = cell.agents[numBullets-1];
			cell.bullets[bulletIndex].index = bulletIndex;
			cell.bullets.splice(numBullets-1,1);
		}
		
		bullet.index = -1;
		bullet.ownerCell = -1;
	}
	
	//*********************************
	//           For hitboxes and doors
	//*********************************
	addHitbox(hitbox){
		let cell = this.getCellFromPosition(hitbox.x,hitbox.y);
		let numHitboxes = cell.hitboxes.length;
		cell.hitboxes[numHitboxes] = hitbox;
		hitbox.ownerCell = cell.index;
	}

	addDoor(door){
		let cell = this.getCellFromPosition(door.hitbox.x,door.hitbox.y);
		let numDoors = cell.doors.length;
		cell.doors[numDoors] = door;
		door.hitbox.ownerCell = cell.index;
	}
}

module.exports = Grid;
*/