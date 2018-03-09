
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

var forcetime = 200; // 200    FIXA ASAP!!!

var steplength = 0.01; // 0.05

var inertiaRed = 0.000044175; // 0.00005
var frictionRed = 0.0000024; // 0.0000024
var radiusRed = 0.026; // 0.026

var spinareaRed = 0.00035; // 0.00035

var spinredmass = 0.0560; // 0.0560

var inertiaSilver = 0.00022697; // 0.00022697
var frictionSilver = 0.0000024; // 0.0000024
var radiusSilver = 0.04; // 0.04
var spinareaSilver = 0.000735; // 0.000735 
var spinsilvermass = 0.112;

var inertiaGreen = 0.00037798; // 0.00037798
var frictionGreen = 0.0000024; // 0.0000024
var radiusGreen = 0.042; // 0.042
var spinareaGreen = 0.001; // 0.001
var spingreenmass = 0.196;

var slider = document.getElementById("initialforce");
var output = document.getElementById("demo");
var velocityoutput = document.getElementById("velocity");
var currentmass = document.getElementById("mass"); 

var inertia = document.getElementById("inertia");
var airRes = document.getElementById("drag");

// Variabler för start
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var ismousedown = false;
var isclicked = false;

var startposX;
var startposY;

var endposX;
var endposY;

var timedown = 0;
var starttimez = 0;
var endtime = 0;

var dis = 0;
var massForce = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 2000 );
camera.position.set(0, 0, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth*0.85, window.innerHeight*0.85 );
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
var sceneRootRed = new THREE.Group();
var sceneRootSilver = new THREE.Group();
var sceneRootGreen = new THREE.Group();
scene.add(sceneRootRed);
scene.add(sceneRootSilver);
scene.add(sceneRootGreen);

// Spinner options
var spinnerRed = new Spinner(radiusRed, inertiaRed, frictionRed, spinareaRed, "textures/red.png", "spinners/spinner.obj", spinredmass,0.042);
var spinnerSilver = new Spinner(radiusSilver, inertiaSilver, frictionSilver, spinareaSilver, "textures/metal.jpg", "spinners/gulbatman.obj", spinsilvermass,0.08);
var spinnerGreen = new Spinner(radiusGreen, inertiaGreen, frictionGreen, spinareaGreen, "textures/marble.jpg", "spinners/tredjespinner.obj", spingreenmass,0.053);

init();
force = 0;
animate();

function init(){

	//texture = textureLoader.load( currentSpinner.texture );
	textureRed = textureLoader.load(spinnerRed.texture);
	textureSilver = textureLoader.load(spinnerSilver.texture);
	textureGreen = textureLoader.load(spinnerGreen.texture);

	// initialize start time
	// startTime = Date.now();

	// load a resource
	loader.load(spinnerRed.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = textureRed;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRootRed.add( object );

		}
	);

	// load a resource
	loader.load(spinnerSilver.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = textureSilver;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRootSilver.add( object );

		}
	);

	sceneRootSilver.translateZ(5000); //translatera ur bild
	


	// load a resource
	loader.load(spinnerGreen.object,
		// called when resource is loaded
		function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = textureGreen;

				}

			} );
			// Rätar upp fidget 
			object.rotation.x = pi/2;
			// lägger till fidget i scenen
			sceneRootGreen.add( object );

		}
	);

	sceneRootGreen.translateZ(5000); //translatera ur bild
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}


function animate() {

	animationFrame = requestAnimationFrame( animate );
	render();

}

function render() {

	MousePos();

	//Force
	output.innerHTML = slider.value;
	slider.oninput = function() {
		output.innerHTML = this.value;
	}

	//time = Date.now();
	//ellapsedTime = time - startTime;
	//console.log("start ellapsedTime = " + ellapsedTime);

	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children, true);
	
	
	
	
	if (intersects.length > 0)
	{
		// stannar fidget när man dubbelklickar
		document.addEventListener("dblclick", Stop, false);
		
	}
	
	if (fidget == 1)
	{
		massForce = spinnerRed.mass;
	}	

	if (fidget == 2)
	{
		massForce = spinnerSilver.mass;
	}	

	if (fidget == 3)
	{
		massForce = spinnerGreen.mass;
	}		
	
	
	if (intersects.length > 0 && ismousedown) 
	{		
		force = massForce * ((dis * timedown) / timedown);
		spinnerRed.restartSpintimez();
		spinnerSilver.restartSpintimez();
		spinnerGreen.restartSpintimez();
		console.log("massForce = " + massForce);
		console.log("dis = " + dis);
		console.log("timedown = " + timedown);
		console.log("force = " + force);


		//console.log("in loop ellapsedTime = " + ellapsedTime);
	}
	
	
	
	// if(force != 0 && ellapsedTime > forcetime) //200 millisec = 0.2 sec
		// force = 0; //after some time, stop applying force

	if (fidget == 1){
		spinnerRed.spin(force, steplength); 
		sceneRootRed.rotation.z += spinnerRed.angularPosition - spinnerRed.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerRed.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerRed.mass;
		inertia.innerHTML = spinnerRed.inertia;
		airRes.innerHTML = spinnerRed.airResistance.toFixed(10);
	}
	else if (fidget == 2){
		spinnerSilver.spin(force, steplength);
		sceneRootSilver.rotation.z += spinnerSilver.angularPosition - spinnerSilver.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerSilver.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerSilver.mass;
		inertia.innerHTML = spinnerSilver.inertia;
		airRes.innerHTML = spinnerSilver.airResistance.toFixed(10);
	}
	else if (fidget == 3){
		spinnerGreen.spin(force, steplength);
		sceneRootGreen.rotation.z += spinnerGreen.angularPosition - spinnerGreen.oldPosition;
		//Velocity
		velocityoutput.innerHTML = Number(spinnerGreen.angularVelocity.toFixed(5));
		//Mass
		currentmass.innerHTML = spinnerGreen.mass;
		inertia.innerHTML = spinnerGreen.inertia;
		airRes.innerHTML = spinnerGreen.airResistance.toFixed(10);
	}

	renderer.render(scene, camera);

}

/*****************************************
*        HANTERAR VAL AV SPINNER         *
*****************************************/

function updateCurrentSpinner(number) {
	if (number === 1){
		fidget = 1;
		moveAway(sceneRootSilver);
		moveAway(sceneRootGreen);
		spinnerGreen.stopSpin();
		spinnerSilver.stopSpin();
		moveToOrigin(sceneRootRed);
		stop();
	}
	else if (number === 2){
		fidget = 2;
		moveAway(sceneRootRed);
		moveAway(sceneRootGreen);
		spinnerGreen.stopSpin();
		spinnerRed.stopSpin();
		moveToOrigin(sceneRootSilver);
		stop();
	}
	else if (number === 3){
		fidget = 3;
		moveAway(sceneRootSilver);
		moveAway(sceneRootRed);
		spinnerRed.stopSpin();
		spinnerSilver.stopSpin();
		moveToOrigin(sceneRootGreen);
		stop();
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
	{
		Start();
		isclicked = true;
	}
	else 
	{
		Stop();
		isclicked = false;
	}

}

function Stop(){
	force = 0;
	spinnerRed.stopSpin();
	spinnerSilver.stopSpin();
	spinnerGreen.stopSpin();
	isStopped = true;
	document.getElementById("button").innerHTML = "START";

}

function Start(){

	// restartTime();
	force = document.getElementById("initialforce").value;
	isStopped = false;
	document.getElementById("button").innerHTML = "STOPP";
	

}

// function restartTime(){ 

	// startTime = Date.now(); 
// }

/*************************************
*     Starta fidget med mustryck	 *
*************************************/

function MousePos() {
	
	document.onmousedown = function(a){
		
		ismousedown = true;
		
		startposX = a.pageX;
		startposY = a.pageY;
		// console.log("Start: X = " + startposX + ", Y = " + startposY);
		
		starttimez = Date.now();
		
	}

	document.onmouseup = function(a){
		
		ismousedown = false;
		
		endposX = a.pageX;
		endposY = a.pageY;
		// console.log("Stopp: X = " + endposX + ", Y = " + endposY);
		
		endtime = Date.now();
		
		
		dis = Math.pow((endposX-startposX), 2) + Math.pow((endposY-startposY), 2);
		dis = Math.sqrt(dis);
		
		timedown = endtime - starttimez;
		
		console.log("Tid: " + timedown);
		console.log("Sträcka: " + dis);
	}
	

}

function onDocumentMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// console.log("mouse.x = " + mouse.x + ", mouse.y = " + mouse.y);

}


function stopFidget( event ) {
	console.log("Kör stopFidget()");
	stop();
	
}




