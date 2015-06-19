
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
	
	var light = new THREE.AmbientLight( 0x030303 ); // soft white light
	scene.add( light );

/*	light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );*/
/*sdd
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
	var atmoSize = 60;
	var sunSize  = 50;
	var atmoD = 150;
	var deltaAtmo = 0.3;
	for(var i=atmoSize; i>sunSize; i -= deltaAtmo){
		var sun = createPlanet(i, 0.1, "yellow.jpeg", 0, (atmoSize -i)/atmoD , 0xffffff);
		sun.position.x = 0;
		sun.position.z = 0;
		scene.add(sun);
		//planets.push(sun);
	}


	//sun atmosphere
	var sun1 = createPlanet(sunSize, 0.1, "sun.jpg", 0 , 0.99, 0xffff00);
	sun1.position.x = 0;
	sun1.position.z = 0;
	planets.push(sun1);

	for(var i=0; i< 1000; i++){
		var mat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 1, emissive: 0x707070 });
		var g = new THREE.SphereGeometry(0.3, 2, 2);
		var mesh1 = new THREE.Mesh(g, mat);
		mesh1.position.x=Math.random()*1000 - Math.random()*1000;
		mesh1.position.y=Math.random()*100- Math.random()*100;
		mesh1.position.z=Math.random()*1000 - Math.random()*1000;
		scene.add(mesh1)
	}




	var pointColor = "#ffffff";
	var pointLight = new THREE.PointLight(pointColor);
	pointLight.distance = 1000;
	pointLight.position = sun1.position;
	scene.add(pointLight);
	var pointLight2 = new THREE.PointLight(pointColor);
	pointLight2.distance = 1000;
	pointLight2.position = sun1.position;
	scene.add(pointLight2);



	var planet2 = createPlanet(40, 0.5, "uranus.jpg", 0.004);
	planet2.setGravitySource(sun1, 400, 0, 0.01);
	planet2.receiveShadow = true;
	planets.push(planet2);

	
	var planet4 = createPlanet(50, 0.5, "jupiter.png", 0.004);
	planet4.setGravitySource(sun1, 500, Math.PI/2, 0.01);
	planet4.receiveShadow = true;
	planets.push(planet4);

	var planet3 = createPlanet(15, 0.5, "mars.jpg", 0.003);
	planet3.setGravitySource(planet2, 100, 0, 0.03);
	planet4.receiveShadow = true;
	planets.push(planet3);

	var planet6 = createPlanet(30, 0.5, "sun.png", 0.004);
	planet6.setGravitySource(sun1, 800, Math.PI/2, 0.01);
	planets.push(planet6);

	var planet7 = createPlanet(40, 0.5, "grass.jpg", 0.004);
	planet7.setGravitySource(sun1, 800, -Math.PI, 0.01);
	planets.push(planet7);

	var asteroid = createPlanet(10, 0.5, "blue.jpeg", 0.004, 1, 0x0000ff);
	asteroid.setGravitySource(sun1, 1800, Math.PI/2, 0.1);
	planets.push(asteroid);

	var planet8 = createPlanet(35, 0.4, "g.jpg", 0.004);
	planet8.setGravitySource(sun1, 300, -Math.PI/2, 0.01);
	planets.push(planet8);

	var planet9 = createPlanet(15, 0.4, "abb.jpg", 0.002);
	planet9.setGravitySource(planet8, 80, Math.PI/6, 0.01);
	planets.push(planet9);

	var planet10 = createPlanet(10, 0.4, "abb.jpg", 0.002);
	planet10.setGravitySource(planet8, 110, -Math.PI, 0.02);
	planets.push(planet10);
	

	
	
	for(var i=0; i<planets.length; ++i){
		scene.add(planets[i]);
		objects.push(planets[i]);
	}
	
/*	var axisHelper = new THREE.AxisHelper(100);
	scene.add( axisHelper );*/
	
	
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
        geometry.scale.set(1,1, 1);
        geometry.rotation.x = -0.3;
        
        var observer = geometry;
		observer.centerHeight = 10;
		observer.position.set(400, 100, 100);
		observer.receiveShadow = true;
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
