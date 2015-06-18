
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

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

	camera.position.set(0, 500, 0);
	camera.lookAt(new THREE.Vector3(0, 0, -1));
	camera.rotation.z = 0;
	scene.add(camera);

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );



/*
	light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );*/


	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );


	document.body.appendChild( renderer.domElement );



	window.addEventListener( 'resize', onWindowResize, false );

/*	var mat = new THREE.MeshPhongMaterial( { color: 0xffff00, transparent: true, opacity: 1 });
	var mesh = new THREE.Mesh(new THREE.SphereGeometry(120, 20, 20), mat);
	scene.add(mesh);*/


	//sun
	for(var i=60; i>50; i -= 0.3){
		var sun = createPlanet(i, 0.1, "yellow.jpeg", 0, (60 -i)/160 );
		sun.position.x = 0;
		sun.position.z = 0;
		scene.add(sun);
		//planets.push(sun);
	}

	//sun atmosphere
	var sun1 = createPlanet(49, 0.1, "sun.jpg", 0 , 0.99);
	sun1.position.x = 0;
	sun1.position.z = 0;
	planets.push(sun1);

/*	var lightDistFromSun = 9;
	var pointColor = "#ffffff";
	var pointLight = new THREE.PointLight(pointColor);
	pointLight.distance = 1000;
	pointLight.position = sun1.position;
	pointLight.position.x = sun1.position.x+lightDistFromSun;
	scene.add(pointLight);*/
/*	var pointLight = new THREE.PointLight(pointColor);
	pointLight.distance = 1000;
	pointLight.position = sun1.position;
	pointLight.position.x = sun1.position.x-lightDistFromSun;
	scene.add(pointLight);*/



	var planet2 = createPlanet(40, 0.5, "metal-rust.jpg", 0.004);
	planet2.setGravitySource(sun1, 220, 0, 0.01);
	planets.push(planet2);

	var planet3 = createPlanet(15, 0.5, "floor-wood.jpg", 0.003);
	planet3.setGravitySource(planet2, 80, 0, 0.03);
	planets.push(planet3);

	var planet4 = createPlanet(50, 0.5, "metal-rust.jpg", 0.004);
	planet4.setGravitySource(sun1, 300, Math.PI/2, 0.01);
	planets.push(planet4);

	var planet5 = createPlanet(40, 0.5, "metal-rust.jpg", 0);
	planet5.position.set(120, 0, 90);
	planets.push(planet5);


	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
		objects.push(planets[i]);
	}

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

        var observer = geometry;
		observer.centerHeight = 10;
		observer.position.set(400, 100, 100);
		scene.add(observer);

		controls = new GravityControls(camera, observer, planets);

		animate();
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
