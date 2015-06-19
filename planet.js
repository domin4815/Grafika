function createMesh(geom, imageFile, transparency) {
    var texture = THREE.ImageUtils.loadTexture("textures/" + imageFile);
    var mat = new THREE.MeshPhongMaterial({ transparent: true, opacity: transparency  });
    mat.map = texture;

    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
}

function createPlanet(radius, density, textureName, rotationSpeed, transparency){
	var planet = createMesh(new THREE.SphereGeometry(radius, 20, 20), textureName, transparency);
	planet.radius = radius;
	planet.mass = density*radius*radius*radius*Math.PI*4/3;
	planet.rotationSpeed = rotationSpeed;
	planet.gravitySource = null;
	planet.movement = new THREE.Vector3(0, 0, 0);
	
	planet.move = function(){
		planet.rotation.y += planet.rotationSpeed;
		if(planet.gravitySource != null){
			planet.orbitPhase += planet.orbitSpeed;
			var newPosition = new THREE.Vector3(0, 0, 0);
			
			newPosition.x = planet.gravitySource.position.x + planet.gravitySourceDistance * Math.cos(planet.orbitPhase);
			newPosition.z = planet.gravitySource.position.z + planet.gravitySourceDistance * Math.sin(planet.orbitPhase);
			planet.movement.subVectors(newPosition, planet.position);
			planet.position.copy(newPosition);
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