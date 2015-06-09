function createMesh(geom, imageFile) {
    var texture = THREE.ImageUtils.loadTexture("textures/" + imageFile);
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
}

function createPlanet(radius, density, textureName, rotationSpeed){
	var planet = createMesh(new THREE.SphereGeometry(radius, 20, 20), textureName);
	planet.radius = radius;
	planet.mass = radius*radius*radius*3.14*4/3;
	planet.rotationSpeed = rotationSpeed;
	planet.gravitySource = null;

	//velocity vectors
	planet.vectorX = 0.4;
	planet.vectorY = 0;
	planet.vectorZ = 0.4;
	
	planet.move = function(){

		planet.gravity();
		planet.position.x += planet.vectorX;
		//planet.position.y += planet.vectorY;
		planet.position.z += planet.vectorZ;



		/*		planet.rotation.y += planet.rotationSpeed;
                        if(planet.gravitySource != null){
                 planet.orbitPhase += planet.orbitSpeed;
                 planet.position.x = planet.gravitySource.position.x + planet.gravitySourceDistance * Math.cos(planet.orbitPhase);
                 planet.position.z = planet.gravitySource.position.z + planet.gravitySourceDistance * Math.sin(planet.orbitPhase);
                 }*/
	};

	planet.gravity = function(){
		dx =  ((planet.position.x - planet.gravityCenterX)); //distance from the gravity center
		dy =  ((planet.position.y - planet.gravityCenterY));
		dz =  ((planet.position.z - planet.gravityCenterZ));

		dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
		sin = dz/dist;
		cos = dx/dist;
		gravityVector = 10/(dist*dist); //10 gravity strength
		planet.vectorX -= gravityVector*cos;
		planet.vectorZ -= gravityVector*sin;
	};

	planet.setGravitySource = function(source, distance, orbitPhase, orbitSpeed, coordX, coordY, coordZ){
		planet.gravitySource = source;
		planet.gravitySourceDistance = distance;
		planet.orbitPhase = orbitPhase;
		planet.orbitSpeed = orbitSpeed;
		planet.gravityCenterX = coordX;
		planet.gravityCenterY = coordY;
		planet.gravityCenterZ = coordZ;
	};
	return planet;
}




