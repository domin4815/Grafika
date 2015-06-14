
var camera, camGroup, scene, renderer;
var controls;
var skybox;

var objects = [];

var planets = [];

var printer = document.getElementById("printer");
var printerCamX = document.getElementById("printerCamX");
var printerCamY = document.getElementById("printerCamY");
var printerCamZ = document.getElementById("printerCamZ");
var printerRotX = document.getElementById("printerRotX");
var printerRotY = document.getElementById("printerRotY");
var printerRotZ = document.getElementById("printerRotZ");
var printerObsX = document.getElementById("printerObsX");
var printerObsY = document.getElementById("printerObsY");
var printerObsZ = document.getElementById("printerObsZ");
var printerDirX = document.getElementById("printerDirX");
var printerDirY = document.getElementById("printerDirY");
var printerDirZ = document.getElementById("printerDirZ");


init();
animate();


function updatePrinter(){
	printerCamX.textContent = "cam x = " + camera.position.x;
	printerCamY.textContent = "cam y = " + camera.position.y;
	printerCamZ.textContent = "cam z = " + camera.position.z;
	printerRotX.textContent = "rot x = " + camera.rotation.x;
	printerRotY.textContent = "rot y = " + camera.rotation.y;
	printerRotZ.textContent = "rot z = " + camera.rotation.z;
	printerObsX.textContent = "obs x = " + observer.position.x;
	printerObsY.textContent = "obs y = " + observer.position.y;
	printerObsZ.textContent = "obs z = " + observer.position.z;
	var direction = controls.getDirection();
	printerDirX.textContent = "dir x = " + direction.x;
	printerDirY.textContent = "dir y = " + direction.y;
	printerDirZ.textContent = "dir z = " + direction.z;
}

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	
	camera.position.set(0, 100, 0);
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
	
	var planet1 = createPlanet(50, 0.5, "floor-wood.jpg", 0.00);
	planet1.position.x = 0;
	planet1.position.z = 0;
	planets.push(planet1);

	var planet2 = createPlanet(20, 0.5, "metal-rust.jpg", 0.04);
	planet2.setGravitySource(planet1, 140, 0, 0.01);
	planets.push(planet2);
	
	var planet3 = createPlanet(10, 0.5, "floor-wood.jpg", 0.03);
	planet3.setGravitySource(planet2, 40, 0, 0.03);
	planets.push(planet3);
	
	var planet4 = createPlanet(15, 0.5, "metal-rust.jpg", 0.04);
	planet4.setGravitySource(planet1, 120, Math.PI/2, 0.01);
	planets.push(planet4);
	
	
	
	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
		objects.push(planets[i]);
	}
	
	console.log("camera rotation");
	console.log(camera.rotation);
	
	observer = createPlanet(3, 0.5, "floor-wood.jpg", 0.0);
	observer.centerHeight = observer.radius;
	scene.add(observer);

	controls = new GravityControls(camera, observer);
	controls.setGravitySource(planets[0]);
	
	var axisHelper = new THREE.AxisHelper(100);
	scene.add( axisHelper );
	
	skybox = createSkybox();
	scene.add(skybox);
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
