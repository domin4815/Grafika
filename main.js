
var camera, camGroup, scene, renderer;
var controls;
var skybox;

var gravitySourceIndex = 0;

var objects = [];

var planets = [];

var gravityStrengths;

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
var printerGravitySource = document.getElementById("printerGravitySource");
var printerGravity = document.getElementById("printerGravity");


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
	printerGravitySource.textContent = "gravity source = " + gravitySourceIndex;
	
	var gravitiesText = gravityStrengths.reduce(function(a, b){return  a + "<br/>" + b;}, "gravities:");
	gravitiesText += "<br/>" + controls.afterLanding;
	printerGravity.innerHTML = gravitiesText;
}

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	
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
	//sun
	var sun = createPlanet(80, 0.1, "sun.jpg", 0, 0.3);
	sun.position.x = 0;
	sun.position.z = 0;
	planets.push(sun);
	var sun = createPlanet(70, 0.1, "sun.jpg", 0, 0.3);
	sun.position.x = 0;
	sun.position.z = 0;
	planets.push(sun);
	//sun atmosphere
	var atmosphere = createPlanet(60, 0.1, "sun.jpg", 0 , 0.99);
	atmosphere.position.x = 0;
	atmosphere.position.z = 0;
	planets.push(atmosphere);



	var planet2 = createPlanet(40, 0.5, "metal-rust.jpg", 0.004);
	planet2.setGravitySource(sun, 220, 0, 0.01);
	planets.push(planet2);
	
	var planet3 = createPlanet(15, 0.5, "floor-wood.jpg", 0.003);
	planet3.setGravitySource(planet2, 80, 0, 0.03);
	planets.push(planet3);
	
	var planet4 = createPlanet(50, 0.5, "metal-rust.jpg", 0.004);
	planet4.setGravitySource(sun, 300, Math.PI/2, 0.01);
	planets.push(planet4);
	
	var planet5 = createPlanet(40, 0.5, "metal-rust.jpg", 0);
	planet5.position.set(90, 0, 90);
	planets.push(planet5);
	
	
	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
		objects.push(planets[i]);
	}
	
	observer = createPlanet(3, 0.5, "floor-wood.jpg", 0.0);
	observer.centerHeight = observer.radius;
	observer.position.set(100, 100, 100);
	scene.add(observer);

	controls = new GravityControls(camera, observer, planets);
	//controls.init(70);
	
	//controls.setGravitySource(planets[0]);
	
	var axisHelper = new THREE.AxisHelper(100);
	scene.add( axisHelper );
	
	
	gravityStrengths = planets.map(function(x){return 0;});
	
	skybox = createSkybox();
	scene.add(skybox);
	
	
	var loader = new THREE.OBJLoader();
    loader.load('sat.obj', function (geometry) {
        var material = new THREE.MeshLambertMaterial({color: 0xffffff});

        // geometry is a group of children. If a child has one additional child it's probably a mesh
        geometry.children.forEach(function (child) {
            if (child.children.length == 1) {
                if (child.children[0] instanceof THREE.Mesh) {
                    child.children[0].material = material;
                }
            }
        });

        mesh = geometry;
        geometry.scale.set(4,4, 4);
        geometry.rotation.x = -0.3;
        geometry.position.set(100, 100, 100);
        scene.add(geometry);
    });
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
	
	controls.update();

	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}
