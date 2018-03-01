class Spinner {

	constructor(radius, inertia, friction, spinarea, texture, object, mass){
		this.radius = radius; 
		this.friction = friction; 
		this.inertia = inertia;
		this.angularPosition = 0;
		this.angularVelocity = 0;
		this.texture = texture;
		this.object = object;
		this.spinarea = spinarea;
		this.airResistance = 0;		 
		this.oldPosition = 0;
		this.mass = mass;
 	}

	spin(force, stepLength) { // Updates angular position with euler
		var angularAcceleration = (1/(this.inertia)) * (this.radius*force - this.friction*this.angularVelocity - this.airResistance*this.angularVelocity);
		this.angularVelocity = this.angularVelocity + stepLength*angularAcceleration;
		this.oldPosition = this.angularPosition;
		this.angularPosition = this.angularPosition + stepLength*this.angularVelocity;
		
		// 0.5 i formel, 0.4 är luftmotståndskoefficient 1.2 är luftens densitet
		this.airResistance = 0.5 * 0.4 * 1.2041 *  this.spinarea * Math.pow(this.radius*this.angularVelocity , 2);
	}

	stopSpin(){
		this.airResistance = 0;
		this.angularPosition = 0;
		this.angularVelocity = 0;
	}

}