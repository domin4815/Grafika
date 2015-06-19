function createSkybox(){
/*	console.log("creating skybox");
    var imagePrefix = "textures/dawnmountain-";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";
    console.log(skyGeometry);*/
    var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            //map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            map: THREE.ImageUtils.loadTexture("textures/stars2.jpg"),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    console.log(skyBox);
    return skyBox;
}