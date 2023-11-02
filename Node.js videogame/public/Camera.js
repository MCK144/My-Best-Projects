class Camera{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.playerW = 0;
		this.playerH = 0;
		this.screenWidth = document.getElementsByTagName("canvas")[0].width;
		this.screenHeight = document.getElementsByTagName("canvas")[0].height;

	}
	update(sprite){
		this.x = sprite.x;
		this.y = sprite.y;
		//updating player width and height aren't necessary, 
		//but this is the most convenient thing I can think of
		this.playerW = sprite.w;
		this.playerH = sprite.h;
		
	}

	translate(x,y){
		return [x - this.x + this.screenWidth / 2.0 - this.playerW / 2.0,
						y - this.y + this.screenHeight/ 2.0 - this.playerH / 2.0];
	}
	
}

export {Camera};