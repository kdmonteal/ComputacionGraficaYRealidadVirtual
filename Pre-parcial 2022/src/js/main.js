/* Author(a): Kelly Daniella Marin
   Date of creation: 10 Agosto 2022
   Last Modification: 5 Octubre 2022 / 13:50 PM
 */

// var: Pueden declar sin inicializar. 
// let: Pueden declar sin inicializar.
// const: Pueden declar con valor.  
// console.log(THREE);

// Creando variables iniciales del programa
var scene = null,
    camera = null,
    renderer = null,
    controls = null;

var modPlayer = null,
    pointLight = null;

function start() {
    // Call function to create scene
    initScene();
    // Call function to Animate by Frame
    animate();
}

function redimensionar() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

function initScene() {
    // Scene, Camera, Renderer
    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
		
    // Create Camera (3D)
    camera = new THREE.PerspectiveCamera(75, // Fov (campo de vision)
        window.innerWidth / window.innerHeight, // aspect (tamano pantalla)
        0.1, // near (Cercano)
        1000); // far (Lejano)

    // To renderer
    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // To Make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // To create Grid
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Make Adds
    scene.add(camera);
    camera.position.set(3.9, 3.7, 4.7);
    controls.update();
    window.addEventListener('resize', redimensionar);

    // Create Object with images texture
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

    const light = new THREE.AmbientLight(0xFFE74F, 0.4); // soft white light
    scene.add(light);

    pointLight = new THREE.PointLight(0xffffff, 0.3, 30);
    pointLight.position.set(0, 10, 2);
    scene.add(pointLight);

    // ground

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);
    loadModel_objectModelAndMtl("./src/Modelos/OBJ/personaje/Guerrero/", "Guerrero", true, 1);
    generateUI();
}

function loadModel_objectModelAndMtl(pathGeneralFolder, pathFile, show, modelScale) {
    if (show == true) {
        var mtlLoader2 = new THREE.MTLLoader();
        mtlLoader2.setTexturePath(pathGeneralFolder);
        mtlLoader2.setPath(pathGeneralFolder);
        mtlLoader2.load(pathFile + ".mtl", function (materials) {
            materials.preload();

            var objLoader2 = new THREE.OBJLoader();
            objLoader2.setMaterials(materials);
            objLoader2.setPath(pathGeneralFolder);
            objLoader2.load(pathFile + ".obj", function (Object) {
                modPlayer = Object;
                modPlayer.position.y = 0.3;
                modPlayer.scale.set(modelScale, modelScale, modelScale);
                scene.add(Object);
            });
        });
    }
}

function generateUI() {
    var gui = new dat.GUI({width:180});
    var param = {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        movX: 0,
        movY: 0,
        movZ: 0,
        scale: 1,
        ColorLight: "#ffffff",
        Intensity: 0.5
    };

    var m = gui.addFolder("Mover");
    var e = gui.addFolder("Escalar");
    var r = gui.addFolder("Rotar");
    var l = gui.addFolder("Lights");

    var movementX = m.add(param,'movX').min(-10).max(10).step(1).name("X");
    var movementY = m.add(param,'movY').min(-10).max(10).step(1).name("Y");
    var movementZ = m.add(param,'movZ').min(-10).max(10).step(1).name("Z");

    movementX.onChange(function (valueX) {
        modPlayer.position.x = valueX;
    });

    movementY.onChange(function (valueY) {
        modPlayer.position.y = valueY;
    });

    movementZ.onChange(function (valueZ) {
        modPlayer.position.z = valueZ;
    });

    var myScale = e.add(param,'scale').min(1).max(10).step(1).name("Scale");

    myScale.onChange(function (myScaleN) {
        modPlayer.scale.set(myScaleN,myScaleN,myScaleN);
    });

    var myRotationX = r.add(param,'rotX').min(-1).max(1).step(0.1).name("X");
    var myRotationY = r.add(param,'rotY').min(-1).max(1).step(0.1).name("Y");
    var myRotationZ = r.add(param,'rotZ').min(-1).max(1).step(0.1).name("Z");

    myRotationX.onChange(function (rotationX) {
        modPlayer.rotation.x = Math.PI*rotationX;
    });

    myRotationY.onChange(function (rotationY) {
        modPlayer.rotation.y = Math.PI*rotationY;
    });

    myRotationZ.onChange(function (rotationZ) {
        modPlayer.rotation.z = Math.PI*rotationZ;
    });

    var myColor = l.addColor(param, 'ColorLight');
    var myIntensity = l.add(param, 'Intensity').min(0).max(1).step(0.1);

    myColor.onChange(function (colorGet) {
        console.log("Chage Color " + colorGet);
        pointLight.color.setHex(Number(colorGet.toString().replace('#', '0x')));
    });

    myIntensity.onChange(function (intensity) {
        pointLight.intensity = intensity;
    });
}

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);

    console.log(camera.position);
}