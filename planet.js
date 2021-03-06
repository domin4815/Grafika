function createMesh(geom, imageFile) {
    var texture = THREE.ImageUtils.loadTexture("textures/" + imageFile);
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;
    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
}

function createPlanet(radius, density, textureName, rotationSpeed, q1, q2){
	var planet = createMesh(new THREE.SphereGeometry(radius, q1, q2), textureName);
	//var planet = createMesh(new THREE.BoxGeometry(radius, radius, radius), textureName);
	planet.radius = radius;
	planet.mass = radius*radius*radius*3.14*4/3;
	planet.rotationSpeed = rotationSpeed;
	planet.gravitySource = null;
	
	planet.move = function(){
		planet.rotation.y += planet.rotationSpeed;
		if(planet.gravitySource != null){
			planet.orbitPhase += planet.orbitSpeed;
			planet.position.x = planet.gravitySource.position.x + planet.gravitySourceDistance * Math.cos(planet.orbitPhase);
			planet.position.z = planet.gravitySource.position.z + planet.gravitySourceDistance * Math.sin(planet.orbitPhase);
		}
	};
	
	planet.setGravitySource = function(source, distance, orbitPhase, orbitSpeed){
		planet.gravitySource = source;
		planet.gravitySourceDistance = distance;
		planet.orbitPhase = orbitPhase;
		planet.orbitSpeed = orbitSpeed;
	};
	return planet;
}

function createGlow(radius, q1, q2, op){
	var mat = new THREE.MeshBasicMaterial({
		color: 0xffff00,
		transparent: true,
		opacity: op
	});

	var geom = new THREE.SphereGeometry(radius, q1, q2);

	return new THREE.Mesh(geom, mat);
}