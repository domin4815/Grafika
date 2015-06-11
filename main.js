
var camera, camGroup, scene, renderer;
var controls;

var objects = [];

var planets = [];

var printer = document.getElementById("printer");
var printerX = document.getElementById("printerX");
var printerY = document.getElementById("printerY");
var printerZ = document.getElementById("printerZ");
var printerRotX = document.getElementById("printerRotX");
var printerRotY = document.getElementById("printerRotY");
var printerRotZ = document.getElementById("printerRotZ");
var printerAlpha = document.getElementById("printerAlpha");
var printerPhi = document.getElementById("printerPhi");
var printerTheta = document.getElementById("printerTheta");


init();
animate();


function updatePrinter(){
	printerX.textContent = "x = " + camera.position.x;
	printerY.textContent = "y = " + camera.position.y;
	printerZ.textContent = "z = " + camera.position.z;
	printerRotX.textContent = "rot x = " + camera.rotation.x;
	printerRotY.textContent = "rot y = " + camera.rotation.y;
	printerRotZ.textContent = "rot z = " + camera.rotation.z;
	printerAlpha.textContent = "alpha = " + controls.getAlpha();
	printerPhi.textContent = "phi = " + controls.getPhi();
	printerTheta.textContent = "theta = " + controls.getTheta();
}

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	
	camera.position.set(0, 150, 0);
	camera.lookAt(new THREE.Vector3(0, 0, -1));
	camera.rotation.z = 0;
	scene.add(camera);
	
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );
	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );
	

	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
	
	var planet1 = createPlanet(30, 0.5, "sun.jpg", 0.00);
	planet1.position.x = 0;
	planet1.position.z = 0;
	planets.push(planet1);

	var planet2 = createPlanet(20, 0.5, "jo.jpg", 0.04);
	planet2.setGravitySource(planet1, 70, 0, 0.01);
	planets.push(planet2);
	
	var planet3 = createPlanet(10, 0.5, "mars.jpg", 0.03);
	planet3.setGravitySource(planet2, 40, 0, 0.03);
	planets.push(planet3);
	
	var planet4 = createPlanet(15, 0.5, "metal-rust.jpg", 0.04);
	planet4.setGravitySource(planet1, 75, Math.PI/2, 0.01);
	planets.push(planet4);
	
	var planet5 = createPlanet(15, 0.5, "uranus.jpg", 0.04);
	planet5.position.x = 120;
	planet5.position.z = 40;
	planets.push(planet5);
	
	
	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
		objects.push(planets[i]);
	}

	controls = new GravityControls(camera);
	controls.setGravitySource(planets[0]);
	
	var axisHelper = new THREE.AxisHelper(100);
	scene.add( axisHelper );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
	for(var i=0; i<planets.length; ++i){
		planets[i].move();
	}

	requestAnimationFrame( animate );

	controls.update();
	updatePrinter();

	renderer.render( scene, camera );
}
