function cameraLookDir(camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.euler);
    return vector;
}


function GravityControls(camera, observer){
	this.camera = camera;
	
	var gravitySource = null;
	var gravity;
	var distance;
	
	var direction = new THREE.Vector3(0, 1, 0);
	
	var gravityStrength = 1;
	var cameraHeight = 80;
	
	var movementSpeed = 1.5;
	var rotationSpeed = 0.001;
	var perspectiveAngle = Math.PI / 4;
	var perspectiveOffsetCoeff = 30;
	var cameraHeight = 30;
	
	this.setGravitySource = function(source){
		gravitySource = source;
		gravity = new THREE.Vector3().subVectors(observer.position, source.position);
		//distance = gravity.length();
		distance = 100;
	
		init(50);	
	};
	
	function init(){
		observer.position.set(0, 0, gravitySource.position.z + gravitySource.radius + observer.centerHeight);
		direction.set(0, 1, 0);
		console.log("cam rotation");
		console.log(camera.rotation);
		camera.lookAt(gravitySource);
		
		setTPPCamera();
	}
	
	function setTPPCamera(){
		direction.normalize();
		var gravity = (new THREE.Vector3()).subVectors(gravitySource.position, observer.position);
		var normal = (new THREE.Vector3()).crossVectors(direction, gravity);
		var offset = (new THREE.Vector3()).copy(direction).multiplyScalar(perspectiveOffsetCoeff);
		var cameraPos = (new THREE.Vector3()).copy(gravity).setLength(gravity.length() + cameraHeight).negate().sub(offset)
			.add(gravitySource.position);
		console.log(cameraPos);
		camera.position.copy(cameraPos);
		
		console.log("cam rotation");
		console.log(camera.rotation);
		
		camera.up.copy(offset);
		camera.lookAt(observer.position);
	}
	
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var jumping = false;
	
	var canJump = true;
	
	var step = 0.03;
	var step1 = 0.1;
	var step2 = 0.05;
	var step3 = 0.5;
	
	this.getDirection = function (){
		return direction;
	};
	
	
	function move(forward){
		console.log("");
		
		direction.normalize();
		direction.multiplyScalar(movementSpeed);
		console.log("direction");
		console.log(direction);
		
		
		console.log("gravitySource position");
		console.log(gravitySource.position);
		
		/*var lookDir = cameraLookDir(camera);
		console.log("lookDir");
		console.log(lookDir);
		lookDir.multiplyScalar(0.6);*/
		//camera.position.add(lookDir);
		//camera.rotation.x -= 0.01;
		
		var gravity1 = (new THREE.Vector3()).subVectors(gravitySource.position, observer.position);
		console.log("gravity1");
		console.log(gravity1);
		var newPos1;
		if(forward)
			newPos1 = (new THREE.Vector3()).addVectors(observer.position, direction);
		else
			newPos1 = (new THREE.Vector3()).subVectors(observer.position, direction);
		console.log("newPos1");
		console.log(newPos1);
		
		
		var gravity2 = (new THREE.Vector3()).subVectors(gravitySource.position, newPos1);
		gravity2.setLength(gravity2.length() - gravity1.length());
		console.log("gravity2");
		console.log(gravity2);
		var newPos2 = (new THREE.Vector3()).addVectors(newPos1, gravity2);
		console.log("newPos2");
		console.log(newPos2);
		
		var movement1 = (new THREE.Vector3()).subVectors(newPos1, observer.position).normalize();
		var movement2 = (new THREE.Vector3()).subVectors(newPos2, observer.position).normalize();

		observer.position.copy(newPos2);

		var quat = new THREE.Quaternion();
		quat.setFromUnitVectors(movement1, movement2);

		direction.applyQuaternion(quat);
		
	}
	
	
	function rotate(step){
		var gravity = (new THREE.Vector3()).subVectors(gravitySource.position, observer.position);
		direction.applyAxisAngle(gravity, step);
	}
	
	
	this.update = function(){
		
		if(moveForward){
			move(true);
		}
		if(moveBackward){
			move(false);	
		}
		if(moveRight){
			rotate(rotationSpeed);
		}
		if(moveLeft){
			rotate(-rotationSpeed);
		}
		if(jumping){
			var antigravity = (new THREE.Vector3()).subVectors(observer.position, gravitySource.position)
				.normalize().multiplyScalar(2 * gravityStrength);
			observer.position.add(antigravity);		
		}

		
		var gravity = new THREE.Vector3().subVectors(gravitySource.position, observer.position);
		if(gravity.length() > gravitySource.radius + observer.centerHeight){
			gravity.normalize().multiplyScalar(gravityStrength);
			observer.position.add(gravity);
		}
		
		setTPPCamera();
	};

	
	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				//if ( canJump === true ) velocity.y += 10;
				//canJump = false;
				jumping = true;
				break;
				
			case 49: //1
				init(50);
				break;
		}

	};
	
	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
				
			case 32: // space
				//if ( canJump === true ) velocity.y += 10;
				//canJump = false;
				jumping = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
}