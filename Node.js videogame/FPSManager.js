class FPSManager{

	static startTime = 0;
	static endTime = 0;
	static deltaTime = 0;
	static targetFrametime = 1000/ 60;

	static startFrame(){
		this.startTime = Date.now();
	}
	
	static endFrame(){
		this.endTime = Date.now();

		let frametime = this.endTime - this.startTime;	
		this.deltaTime = frametime / this.targetFrametime;
	}
}

module.exports = FPSManager;