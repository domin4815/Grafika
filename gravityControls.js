'use strict';

var statsPrinter = document.getElementById("statsPrinter");

function GravityControls(camera, observer, planets){
	var scope = this;
	this.camera = camera;
	
	this.observer = observer;
	
	var gravityStrength = 1;
	
	var planetRotationSpeed = 0.001;
	
	this.setGravitySource = function(source){
		this.gravitySource = source;
	};
	
	this.getGravitySource = function(){
		return this.gravitySource;
	};
	
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.jumping = false;
	
	var maxGravity = 0.001;
	
	var spaceSpeed = 1.5;
	var spaceRotationSpeed = 0.05;
	
	
	this.afterLanding = false;
	this.front = new THREE.Vector3(1, 0, 0);
	this.up = new THREE.Vector3(0, 1, 0);
	
	this.update = function(){
		
		if(this.gravitySource){
			var gravity = (new THREE.Vector3()).subVectors(this.gravitySource.position, this.observer.position);
			var gravity1 = new THREE.Vector3().copy(gravity).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.gravitySource.rotationSpeed);
			var spinMovement = new THREE.Vector3().subVectors(gravity, gravity1);
			this.observer.position.add(spinMovement);
			
			if(gravity.length() > this.gravitySource.radius + this.observer.centerHeight){
				gravity.normalize().multiplyScalar(gravityStrength);
				this.observer.position.add(gravity);
			}
		}
		
		if(this.gravitySource && this.afterLanding){
			this.observer.position.add(this.gravitySource.movement);
			
			if(this.moveForward){
				this.moveOnPlanet(true);
			}
			if(this.moveBackward)
				this.moveOnPlanet(false);	
			if(this.moveRight)
				this.rotateOnPlanet(planetRotationSpeed);
			if(this.moveLeft)
				this.rotateOnPlanet(-planetRotationSpeed);
			
			this.setBackCamera();
			
		}else{
			if(this.moveForward)
				this.rotateVerticallyInSpace(spaceRotationSpeed);
			if(this.moveBackward)
				this.rotateVerticallyInSpace(-spaceRotationSpeed);
			if(this.moveRight)
				this.rotateHorizontallyInSpace(spaceRotationSpeed);	
			if(this.moveLeft)
				this.rotateHorizontallyInSpace(-spaceRotationSpeed);	
			this.setBottomCamera();
		}
		
		if(this.jumping){
			var movement = (new THREE.Vector3()).copy(this.up).normalize().multiplyScalar(spaceSpeed);
			this.observer.position.add(movement);		
		}		
		
		// real gravity is 1/gravity here
	
		var oldGravity;
		if(this.gravitySource){
			oldGravity = new THREE.Vector3().subVectors(this.gravitySource.position, this.observer.position)
				.divideScalar(this.gravitySource.mass);
		}else{
			oldGravity = new THREE.Vector3(10000, 10000, 10000);
			gravitySourceIndex = undefined;
			this.afterLanding = false;
		}
			
		//changing gravity source	
		for(var i=0; i<planets.length; ++i){
			var planet = planets[i];
			
			var newGravity = new THREE.Vector3().subVectors(planet.position, this.observer.position);
			if(newGravity.length() <= planet.radius + this.observer.centerHeight){
				this.afterLanding = true;
				this.up.normalize();
				var gravityUnit = new THREE.Vector3().copy(newGravity).negate().normalize();
				var quat = new THREE.Quaternion().setFromUnitVectors(this.up, gravityUnit);
				this.up.applyQuaternion(quat);
				this.camera.up.applyQuaternion(quat);
				this.front.applyQuaternion(quat);
				this.setBackCamera();
			}
			newGravity.divideScalar(planet.mass);
			
			if(oldGravity.length() > newGravity.length()){
				oldGravity = newGravity;
				this.setGravitySource(planet);
			}
		}
		
		if(oldGravity.length() > maxGravity){
			this.setGravitySource(null);
		}
		
		
		//always
		
		this.faceUp();
		
		updateStats(this);
	};

	
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				scope.moveForward = true;
				break;

			case 37: // left
			case 65: // a
				scope.moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				scope.moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				scope.moveRight = true;
				break;

			case 32: // space
				scope.jumping = true;
				break;
		}

	};
	
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				scope.moveForward = false;
				break;

			case 37: // left
			case 65: // a
				scope.moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				scope.moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				scope.moveRight = false;
				break;
				
			case 32: // space
				scope.jumping = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
}