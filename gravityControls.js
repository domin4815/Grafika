function GravityControls(camera){
	this.camera = camera;
	
	var gravitySource;
	var gravity;
	var distance;
	
	var gravityStrength = 1;
	var cameraHeight = 30;
	
	this.setGravitySource = function(source){
		gravitySource = source;
		gravity = new THREE.Vector3().subVectors(camera.position, source.position);
		distance = gravity.length();
		
		camera.lookAt(gravity);
		
	};
	
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var jumping = false;
	
	var canJump = true;
	
	var phi = 0;
	var theta = 0;
	
	var alpha = 0;
	
	var step = 0.03;
	var step1 = 0.1;
	var step2 = 0.04;
	var step3 = 0.5;
	
	this.getAlpha = function(){return alpha;};
	this.getPhi = function(){return phi;};
	this.getTheta = function(){return theta;};
	
	
	this.update = function(){
		if(moveForward){
			phi += step2 * Math.cos(alpha);
			theta += step2 * Math.sin(alpha);
			camera.rotation.x -= step2 * Math.cos(alpha);
			camera.rotation.y -= step2 * Math.sin(alpha);
		}
		if(moveBackward){
			phi -= step2 * Math.cos(alpha);
			theta -= step2 * Math.sin(alpha);
			camera.rotation.x += step2 * Math.cos(alpha);
			camera.rotation.y += step2 * Math.sin(alpha);
		}
		if(moveRight){
			alpha -= step2;
			camera.rotation.z -= step2;
			
		}
		if(moveLeft){
			alpha += step2;
			camera.rotation.z += step2;
		}
		if(jumping){
			distance += 2 * gravityStrength;
		}

		
		//camera.rotation.x = Math.sin(alpha);
		//camera.rotation.x = Math.sin(alpha);
		//camera.rotation.y = Math.cos(alpha);
		
		
		//////////////////////////////////////////////////////////////////////////
		//camera.position.z = Math.cos(phi) * Math.cos(theta) * distance;
		//camera.position.y = Math.sin(phi) * Math.cos(theta) * distance;
		//camera.position.x = - Math.sin(theta) * distance;
		//////////////////////////////////////////////////////////////////////////
		
		if(distance > gravitySource.radius + cameraHeight){
			distance -= gravityStrength;
		}


		camera.position.z = Math.cos(phi) * Math.cos(theta) * distance;
		camera.position.y = Math.sin(phi) * Math.cos(theta) * distance;
		camera.position.x = -Math.sin(theta) * distance;
		
	
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
				
			case 16: //shift
				camera.position.set(0, 0, distance);
				camera.rotation.set(0, 0, 0);
				alpha = 0;
				phi = 0;
				theta = 0;
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