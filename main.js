var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMapEnabled = true;
$("#WebGL-output").append(webGLRenderer.domElement);

var ambiLight = new THREE.AmbientLight(0x141414);
scene.add(ambiLight);

var light = new THREE.DirectionalLight();
light.position.set(0, 30, 20);
scene.add(light);

var planets = [];

function init(){
	camera.position.x = 0;
	camera.position.y = 12;
	camera.position.z = 60;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	var sun = createMesh(new THREE.SphereGeometry(8, 20, 20), "texture_sun.jpg");
	sun.position.x = 0;
	sun.position.y = 0;
	sun.position.z = 0;
	scene.add(sun);
/*	var sun2 = createMesh(new THREE.SphereGeometry(6, 20, 20), "texture_sun.jpg");
	sun2.position.x = 10;
	sun2.position.y = 0;
	sun2.position.z = -10;
	scene.add(sun2);*/
															//wektory x,y,z predkości, od tego zależy orbita którą obierze planeta
	var planet1 = createPlanet(2, 0.5, "metal-rust.jpg", 0.02, -0.4, 0, 0.4);
	planet1.position.x = 40;
	planet1.position.y = 0;
	planet1.position.z = 0;
	planet1.setGravitySource(sun, 20, 0, 0.01);
	planets.push(planet1);

	var planet2 = createPlanet(1, 0.5, "metal-rust.jpg", 0.02, 0, 0, 1.6);
	planet2.position.x = 45;
	planet2.position.y = 0;
	planet2.position.z = 0;
	planet2.setGravitySource(planet1, 20, 0, 0.01);
	planets.push(planet2);

	/*var planet1 = createPlanet(6, 0.5, "floor-wood.jpg", 0.02);
	planet1.position.x = 0;
	planets.push(planet1);
	
	var planet2 = createPlanet(4, 0.5, "metal-rust.jpg", 0.04);
	planet2.setGravitySource(planet1, 20, 0, 0.01);
	planets.push(planet2);
	
	var planet3 = createPlanet(2, 0.5, "floor-wood.jpg", 0.03);
	planet3.setGravitySource(planet2, 10, 0, 0.03);
	planets.push(planet3);
	
	var planet4 = createPlanet(4, 0.5, "metal-rust.jpg", 0.04);
	planet4.setGravitySource(planet1, 20, Math.PI/2, 0.01);
	planets.push(planet4);
	*/
	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
	}
}

function render() {  
    for(var i=0; i<planets.length; ++i){
		planets[i].move();
	}
    
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}

init();

render();