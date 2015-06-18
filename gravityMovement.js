'use strict';

var planetMovementSpeed= 1.5;

GravityControls.prototype.moveOnPlanet = function(forward){
	var direction = new THREE.Vector3().copy(this.front).normalize().multiplyScalar(planetMovementSpeed);
	
	var lookDir = cameraLookDir(camera);
	lookDir.multiplyScalar(0.6);

	var gravity1 = (new THREE.Vector3()).subVectors(this.gravitySource.position, observer.position);
	var newPos1;
	if(forward)
		newPos1 = (new THREE.Vector3()).addVectors(observer.position, direction);
	else
		newPos1 = (new THREE.Vector3()).subVectors(observer.position, direction);
	
	var gravity2 = (new THREE.Vector3()).subVectors(this.gravitySource.position, newPos1);
	gravity2.setLength(gravity2.length() - gravity1.length());
	var newPos2 = (new THREE.Vector3()).addVectors(newPos1, gravity2);
	
	var movement1 = (new THREE.Vector3()).subVectors(newPos1, observer.position).normalize();
	var movement2 = (new THREE.Vector3()).subVectors(newPos2, observer.position).normalize();

	observer.position.copy(newPos2);

	var quat = new THREE.Quaternion();
	quat.setFromUnitVectors(movement1, movement2);

	this.front.applyQuaternion(quat);
	
};


GravityControls.prototype.rotateOnPlanet = function(step){
	var gravity = (new THREE.Vector3()).subVectors(this.gravitySource.position, this.observer.position);
	this.front.applyAxisAngle(gravity, step);
};

GravityControls.prototype.rotateHorizontallyInSpace = function(step){
	this.up.applyAxisAngle(this.front, step);
};

GravityControls.prototype.rotateVerticallyInSpace = function(step){
	var normal = new THREE.Vector3().crossVectors(this.up, this.front);
	this.front.applyAxisAngle(normal, step).normalize();
	this.up.applyAxisAngle(normal, step).normalize();
	this.camera.up.copy(this.up);
};