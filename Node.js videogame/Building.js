const Sprite = require("./Sprite.js");
const Grid_Hitbox = require("./Grid_Hitbox.js");
const Door = require("./Door.js");
const Grid = require("./Grid.js");

const BUILDING_WIDTH = 350;
const BUILDING_HEIGHT = 200;

const WALL_WIDTH = 10;
const DOOR_WIDTH = 70;
const ENTITY_HEIGHT = 60;
const ROOF_HEIGHT = ENTITY_HEIGHT;
const WALL_HEIGHT = BUILDING_HEIGHT - ENTITY_HEIGHT;


const vertWallTexture = "textures/City/street_vertical.png";
const horiWallTexture = "textures/City/street_horizontal.png";
const wallTexture = "textures/City/building_wall.png";
const roofTexture = "textures/City/building_roof.png";

class Building{
	constructor(x,y){		
		//the borders of the building, used for collisions
		this.topBorder = new Grid_Hitbox(x,y,BUILDING_WIDTH,WALL_WIDTH);
		this.bottomBorder = new Grid_Hitbox(x,y+BUILDING_HEIGHT - WALL_WIDTH - ENTITY_HEIGHT,BUILDING_WIDTH - DOOR_WIDTH,WALL_WIDTH);
		this.leftBorder = new Grid_Hitbox(x,y,WALL_WIDTH,BUILDING_HEIGHT);
		this.rightBorder = new Grid_Hitbox(x +BUILDING_WIDTH - WALL_WIDTH,y,WALL_WIDTH,BUILDING_HEIGHT);
		
		let doorPadding = 10;
		let doorHitbox = new Grid_Hitbox(x + BUILDING_WIDTH - DOOR_WIDTH - WALL_WIDTH,y+BUILDING_HEIGHT - WALL_WIDTH - ENTITY_HEIGHT - doorPadding,DOOR_WIDTH,WALL_WIDTH+doorPadding);

		//parts of the building that are rendered
		this.wall = new Sprite(x,y + ROOF_HEIGHT,BUILDING_WIDTH - DOOR_WIDTH,WALL_HEIGHT,wallTexture);
		this.roof = new Sprite(x,y,BUILDING_WIDTH,ROOF_HEIGHT,roofTexture);
		this.door = new Door(x + BUILDING_WIDTH-DOOR_WIDTH-WALL_WIDTH,y + ROOF_HEIGHT, DOOR_WIDTH,BUILDING_HEIGHT - ROOF_HEIGHT,doorHitbox);
		this.roof = new Sprite(x,y,BUILDING_WIDTH,ROOF_HEIGHT,roofTexture);

		
		//add the building hitboxes to the grid
		Grid.addHitbox(this.topBorder);
		Grid.addHitbox(this.bottomBorder);
		Grid.addHitbox(this.leftBorder);
		Grid.addHitbox(this.rightBorder);
		Grid.addDoor(this.door);
	}
}

module.exports = Building;