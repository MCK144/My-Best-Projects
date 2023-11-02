const LINE_WIDTH = "2";

import {TextureCache} from "./TextureCache.js";

class Renderer{
	constructor(){
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = window.innerWidth * 0.75;
		this.canvas.height = window.innerHeight * 0.95;
		this.context = this.canvas.getContext("2d");
		this.images = document.getElementsByTagName("img");
		this.backgroundColor = "rgb(100,100,100)";

		this.context.fillStyle = this.backgroundColor;
		//this.context.lineWidth = LINE_WIDTH;

		// a list of all objects only uploaded by the server once
		this.staticData = [];
		// the data on the spatial partitioning grid
		this.grid = null;
	}

	//a funciton that determines if a sprite is off the screen
	// used to skip drawing certain sprites
	spriteOffScreen(position,sprite){
		let x = position[0];
		let y = position[1];

		return (y + sprite.h <= 0) || (y >= this.canvas.height)||
			(x + sprite.w <= 0) || (x >= this.canvas.width);
	}
	
	drawSprite(sprite,camera){
		//dc = draw coords, the translated position for drawing
		var dc = camera.translate(sprite.x,sprite.y);

		if (this.spriteOffScreen(dc,sprite))
			return;
		
		var texture = TextureCache.getTexture(sprite.texturePath);
		this.context.drawImage(texture,dc[0],dc[1],sprite.w,sprite.h);
	}
	
	drawHitbox(hitbox,camera){
		var dc = camera.translate(hitbox.x,hitbox.y);
		if (this.spriteOffScreen(hitbox,dc))
			return;
		this.context.fillStyle = hitbox.color; //for SOME reason I can't use the variable
		this.context.fillRect(dc[0],dc[1],hitbox.w,hitbox.h);
	}

	drawBullet(bullet,camera){
		var dc = camera.translate(bullet.x,bullet.y);
		this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.arc(dc[0],dc[1],bullet.r,0,Math.PI * 2);
		this.context.fill();
	}
	
	drawStaticData(camera){
		for (let i = 0; i < this.staticData.length; i++){
			this.drawSprite(this.staticData[i],camera);
		}
	}
	//draw all the cells from the spatial partitioning
	drawGrid(camera){
		if (this.grid == null) return;

		this.context.strokeStyle = "red";
		this.context.lineWidth = 4;
		
		//draw the horizontal lines
		let y = 0;
		for (let i = 0; i < this.grid.yCells; i++){
			let pos1 = camera.translate(0,y);
			let pos2 = camera.translate(this.grid.width,y);
			
			this.context.beginPath();
			this.context.moveTo(pos1[0],pos1[1]);
			this.context.lineTo(pos2[0],pos2[1]);
			
			this.context.stroke();
			y += this.grid.cellSize;
		}

		//draw the vertical lines
		let x = 0;
		for (let i = 0; i < this.grid.xCells; i ++){
			let pos1 = camera.translate(x,0);
			let pos2 = camera.translate(x,this.grid.height);
			
			this.context.beginPath();
			this.context.moveTo(pos1[0],pos1[1]);
			this.context.lineTo(pos2[0],pos2[1]);
			this.context.stroke();

			x+= this.grid.cellSize;
		}
	}
	
	drawPlayerInventory(player){
		let inventory = player.inventory;
		if (inventory.length == 0) return;
		
		const ITEM_W = 50;
		const ITEM_H = 50;
		const Y_POS = this.canvas.height - ITEM_H * 2;

		let inventoryWidth = inventory.length * ITEM_W;
		let inventoryHeight = ITEM_H;

		let padding = 5;
		let startX = this.canvas.width / 2 - (ITEM_W/2 * inventory.length) - padding;
		let x = startX;

		this.context.strokeStyle = "cyan";
		this.context.lineWidth = 2;
		this.context.strokeRect(x-padding,Y_POS - padding,inventoryWidth + padding * (2 * inventory.length),ITEM_H + padding *2);
		
		//draw each item
		for (let i = 0; i < inventory.length; i++){
			this.context.beginPath();
			this.context.strokeStyle = "cyan";

			let texture = TextureCache.getTexture(inventory[i].texturePath);
			this.context.drawImage(texture,x, Y_POS,ITEM_W,ITEM_H);
			
			//draw the dividers between the items
			this.context.moveTo(x + ITEM_W + padding, Y_POS - padding);
			this.context.lineTo(x+ITEM_W + padding , Y_POS + ITEM_H + padding);
			this.context.stroke();

			//draw a yellow bar under the selected item
			if (player.selectedItem == i){
				const BAR_H = 2;
				this.context.fillStyle = "yellow";
				this.context.fillRect(x,Y_POS + ITEM_H,ITEM_W, BAR_H);
			}

			x += ITEM_H + padding * 2;

		}
	}

	drawGUI(player,numCitizens,numCriminals,numCops){
		const START_Y = this.canvas.height - 130;
		const GUI_X = 30;
		const GUI_WIDTH = 200;
		const padding = 10;
		const FONT_SIZE = 18;
		const TEXT_HEIGHT = 20;
		let y = START_Y;
		
		this.context.fillStyle = "rgb(200,200,200)";
		this.context.fillRect(GUI_X - padding,START_Y - FONT_SIZE,GUI_WIDTH,(padding + TEXT_HEIGHT) * 5);
		
		this.context.font = FONT_SIZE.toString() + "pt sans";
		this.context.fillStyle = "red";
		this.context.fillText("Health: " + player.health,GUI_X,y);
		y += padding + TEXT_HEIGHT;
		this.context.fillText("Citizens: " + numCitizens,GUI_X,y);
		y += padding + TEXT_HEIGHT;
		this.context.fillText("Criminals: " + numCriminals,GUI_X,y);
		y += padding + TEXT_HEIGHT;
		this.context.fillText("Cops: " + numCops,GUI_X,y);
		y += padding + TEXT_HEIGHT;
		this.context.fillText("Threat level: " + player.threatLevel,GUI_X,y);
	}

	touchingPlayer(player,hitbox,decreaseDistance = false){
		//use the center position of each hitbox
		let xDist = Math.abs(player.sprite.x + player.sprite.w /2 - hitbox.x - hitbox.w / 2);
		let yDist = Math.abs(player.sprite.y + player.sprite.h / 2 - hitbox.y - hitbox.h /2);
		
		//if decreaseDistance == true, then the player will need to be even closer to the object for 
		// 	a collision to count
		let maxXDist = player.sprite.w / 2 + hitbox.w / 2 - 10 * decreaseDistance;
		let maxYDist = player.sprite.h / 2 + hitbox.h / 2 - 10 * decreaseDistance;

		if (xDist <= maxXDist && yDist <= maxYDist)
			return true;
		return false;
		
	}
	
	drawBuilding(building, camera, localPlayer){
		let touchingRoof = this.touchingPlayer(localPlayer,building.roof,true);
		let touchingWall = this.touchingPlayer(localPlayer,building.wall,true);
		let touchingDoor = this.touchingPlayer(localPlayer,building.door,true);
				
		//only draw the building roof and wall if the player is not inside it
		if (!touchingRoof && !touchingWall && !touchingDoor){
			this.drawSprite(building.wall,camera);
			this.drawSprite(building.roof,camera);
		}
		else if (localPlayer.sprite.y > building.bottomBorder.y){
			this.drawSprite(building.wall,camera);
			this.drawSprite(building.roof,camera);
		}
		//draw the wall hitbox if the player is inside the building
		else{
			//draw just the lower half of the wall later
		}
		
		this.drawSprite(building.door,camera);
		this.drawHitbox(building.topBorder,camera);
		this.drawHitbox(building.leftBorder,camera);
		this.drawHitbox(building.rightBorder,camera);
}
	
	clear(){
		this.context.fillStyle = this.backgroundColor;
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
	}

	getCanvas(){
		return this.canvas;
	}
}

export {Renderer};