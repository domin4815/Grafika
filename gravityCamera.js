'use strict';

var cameraHeight = 30;
var perspectiveOffsetCoeff = 30;

GravityControls.prototype.setBackCamera = function(){
	this.front.normalize();
	var gravity = (new THREE.Vector3()).subVectors(this.gravitySource.position, this.observer.position);
	var normal = (new THREE.Vector3()).crossVectors(this.front, gravity);
	var offset = (new THREE.Vector3()).copy(this.front).multiplyScalar(perspectiveOffsetCoeff);
	var cameraPos = (new THREE.Vector3()).copy(gravity).setLength(gravity.length() + cameraHeight).negate().sub(offset)
		.add(this.gravitySource.position);
	this.camera.position.copy(cameraPos);
	
	this.camera.up.copy(gravity).negate();
	this.camera.lookAt(this.observer.position);
	
	this.up.copy(this.camera.up);
};

GravityControls.prototype.setBottomCamera = function(){
	var offset = new THREE.Vector3().copy(this.up).setLength(cameraHeight);
	var camPos = new THREE.Vector3().subVectors(this.observer.position, offset);

	this.camera.position.copy(camPos);
	this.camera.up.copy(this.front).negate();
	this.camera.lookAt(this.observer.position);
};

GravityControls.prototype.faceUp = function(){
	this.observer.up = this.front;
	var faceTarget = new THREE.Vector3().addVectors(this.observer.position, this.up);
	this.observer.lookAt(faceTarget);
};
