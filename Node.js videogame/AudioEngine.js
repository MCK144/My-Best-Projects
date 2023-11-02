const Grid = require("./Grid.js");

class Sound{
	constructor(path,ownerCell){
		this.path = path;
		this.ownerCell = ownerCell;
	}
}


class AudioEngine{
	static sounds = [];
	static numSounds = 0;
	static grid = null;
	
	static loadSound(path, ownerCell){
		//load the sound
		AudioEngine.sounds[AudioEngine.numSounds] = new Sound(path,ownerCell);
		AudioEngine.numSounds += 1;
	}
	
	static reset(){
		AudioEngine.sounds = [];
		AudioEngine.numSounds = 0;
	}
}

module.exports = AudioEngine;