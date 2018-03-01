
var container = document.getElementById( 'container' );
var pi = 3.1415926535;
var ellapsedTime = 0;
var time;
var startTime;
var animationFrame;
var isStopped = true;
var fidget = 1;

// variables to change
//var startForce = 10; //initial force = 10
var forcetime = 200; // 200
var steplength = 0.01; // 0.05

var inertiaRed = 0.00005; // 0.00005
var frictionRed = 0.0000024; // 0.0000024
var radiusRed = 0.026; // 0.026
var spinareaRed = 0.000546; // 0.000546, borde räknas om
var spinredmass = 0.0560; // 0.0560

var inertiaSilver = 0.00022697; // 0.00022697
var frictionSilver = 0.0000024; // 0.0000024
var radiusSilver = 0.04; // 0.04
var spinareaSilver = 0.000546; // fel 
var spinsilvermass = 0.112;

var inertiaGreen = 0.00037798; // 0.00037798
var frictionGreen = 0.0000024; // 0.0000024
var radiusGreen = 0.042; // 0.042
var spinareaGreen = 0.000546; // fel
var spingreenmass = 0.196;

var slider = document.getElementById("initialforce");
var output = document.getElementById("demo");
var velocityoutput = document.getElementById("velocity");
var currentmass = document.getElementById("mass");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 2000 );
camera.position.set(0, 0, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// instantiate a loader
var loader = new THREE.OBJLoader();

// texture
var textureLoader = new THREE.TextureLoader();

// light 
var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( pointLight );
scene.add( camera );

// sceen root
var sceneRoot1 = new THREE.Group();
var sceneRoot2 = new THREE.Group();
var sceneRoot3 = new THREE.Group();
scene.add(sceneRoot1);
scene.add(sceneRoot2);
scene.add(sceneRoot3);

// Spinner options
var spinnerRed = new Spinner(radiusRed, inertiaRed, frictionRed, spinareaRed, "textures/red.png", "spinners/spinner.obj", spinredmass);
var spinnerSilver = new Spinner(radiusSilver, inertiaSilver, frictionSilver, spinareaSilver, "textures/metal.jpg", "spinners/gulbatman.obj", spinsilvermass);
var spinnerGreen = new Spinner(radiusGreen, inertiaGreen, frictionGreen, spinareaGreen, "textures/marble.jpg", "spinners/tredjespinner.obj", spingreenmass);

init();
force = 0;
animate();

function init(){

	//texture = textureLoader.load( currentSpinner.texture );
	texture1 = textureLoader.load(spinnerRed.texture);
	texture2 = textureLoader.load(spinnerSilver.texture);
	texture3 = textureLoader.load(spinnerGreen.texture);

	// initialize start time
	startTime = Date.now();

	// load a resource
	loader.load(spinnerRed.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = texture1;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRoot1.add( object );

		}
	);

	// load a resource
	loader.load(spinnerSilver.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = texture2;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRoot2.add( object );

		}
	);

	sceneRoot2.translateZ(5000); //translatera ur bild
}

	// load a resource
	loader.load(spinnerGreen.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = texture3;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRoot3.add( object );

		}
	);

	sceneRoot3.translateZ(5000); //translatera ur bild

function animate() {

	animationFrame = requestAnimationFrame( animate );
	render();

}

function render() {

	//Force
	output.innerHTML = slider.value;
	slider.oninput = function() {
		output.innerHTML = this.value;
	}

	time = Date.now();
	ellapsedTime = time - startTime;

	if(force != 0 && ellapsedTime > forcetime) //200 millisec = 0.2 sec
		force = 0; //after some time, stop applying force

	if (fidget == 1){
		spinnerRed.spin(force, steplength); 
		sceneRoot1.rotation.z += spinnerRed.angularPosition - spinnerRed.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerRed.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerRed.mass;
	}
	else if (fidget == 2){
		spinnerSilver.spin(force, steplength);
		sceneRoot2.rotation.z += spinnerSilver.angularPosition - spinnerSilver.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerSilver.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerSilver.mass;
	}
	else if (fidget == 3){
		spinnerGreen.spin(force, steplength);
		sceneRoot3.rotation.z += spinnerGreen.angularPosition - spinnerGreen.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerGreen.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerGreen.mass;
	}

	renderer.render(scene, camera);

}

/*****************************************
*        HANTERAR VAL AV SPINNER         *
*****************************************/

function updateCurrentSpinner(number) {
	if (number === 1){
		fidget = 1;
		moveAway(sceneRoot2);
		moveAway(sceneRoot3);
		spinnerGreen.stopSpin();
		spinnerSilver.stopSpin();
		moveToOrigin(sceneRoot1);
	}
	else if (number === 2){
		fidget = 2;
		moveAway(sceneRoot1);
		moveAway(sceneRoot3);
		spinnerGreen.stopSpin();
		spinnerRed.stopSpin();
		moveToOrigin(sceneRoot2);
	}
	else if (number === 3){
		fidget = 3;
		moveAway(sceneRoot2);
		moveAway(sceneRoot1);
		spinnerRed.stopSpin();
		spinnerSilver.stopSpin();
		moveToOrigin(sceneRoot3);
	}
	isStopped = true;
	document.getElementById('button').innerHTML = "START";
}

function moveToOrigin(sceneRoot){
		sceneRoot.position.z = 0;
}

function moveAway(sceneRoot){
		sceneRoot.position.z = 5000;
 }

 /*****************************************
*        HANTERAR KNAPPFUNKTIONEN         *
******************************************/

function Button(){

	if(isStopped)
		Start();
	else 
		Stop();

}

function Stop(){
	spinnerRed.stopSpin();
	spinnerSilver.stopSpin();
	spinnerGreen.stopSpin();
	isStopped = true;
	document.getElementById("button").innerHTML = "START";

}

function Start(){

	restartTime();
	force = document.getElementById("initialforce").value;
	isStopped = false;
	document.getElementById("button").innerHTML = "STOPP";

}

function restartTime(){ startTime = Date.now(); }



