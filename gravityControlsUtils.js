'use strict';

function cameraLookDir(camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.euler);
    return vector;
}


function updateStats(controls){
	var upDirAngle = controls.front.angleTo(controls.up);
	var html = "";
	html += upDirAngle + "<br/>";
	
	statsPrinter.innerHTML = html;
}