/* Author(a): Kelly Daniella Marin
   Date of creation: 10 Agosto 2022
   Last Modification: 18 Agosto 2022 / 13:54 PM
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

var modPlayer = null;

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
    scene.background = new THREE.Color(0x1E7EFC);
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
    /*const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);*/
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Make Adds
    scene.add(camera);
    camera.position.set(40, 37, 54);
    controls.update();
    window.addEventListener('resize', redimensionar);

    // Create Object with images texture
    const light = new THREE.AmbientLight(0xFFE74F, 0.4); // soft white light
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 1, 30);
    pointLight.position.set(0, 10, 2);
    scene.add(pointLight);

    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);
    loadModel_objectModelAndMtl("./src/Modelos/OBJ/personaje/Guerrero/","Guerrero",true);
    generateUI();
}

function loadModel_objectModelAndMtl(pathGeneralFolder, pathFile,show) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath("./src/Modelos/OBJ/mapa/");
    mtlLoader.setPath("./src/Modelos/OBJ/mapa/");
    mtlLoader.load("Mapa-1-Terreno.mtl", function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath("./src/Modelos/OBJ/mapa/");
        objLoader.load("Mapa-1-Terreno.obj", function (Object) {
            Object.scale.set(3, 3, 3);
            Object.position.x = 50;
            scene.add(Object);
        });
    });

    if(show==true){
        var mtlLoader2 = new THREE.MTLLoader();
        mtlLoader2.setTexturePath(pathGeneralFolder);
        mtlLoader2.setPath(pathGeneralFolder);
        mtlLoader2.load(pathFile+".mtl", function (materials) {
            materials.preload();
    
            var objLoader2 = new THREE.OBJLoader();
            objLoader2.setMaterials(materials);
            objLoader2.setPath(pathGeneralFolder);
            objLoader2.load(pathFile+".obj", function (Object) {
                modPlayer = Object;
                scene.add(Object);
            });
        });
    }
}

function generateUI() {
    var gui = new dat.GUI();
    var param = {
                    typeArchive: "OBJ/MTL", // String
                    showModel: true,        // Bool
                    ColorLight: "#ffffff",  // Color
                    Animations: "Idle",     // Animations to FBX
                    Player: "Guerrero", // My player,
                    Intensity: 0.5
    };

    var g = gui.addFolder("Geometry/Models");
    var l = gui.addFolder("Lights");

    var typeGeom   = g.add(param, 'typeArchive', ["FBX", "OBJ/MTL", "GLTF"]);
    var myPlayer   = g.add(param, 'Player', ["Guerrero", "Soldado", "Luigi", "Mario"]);
    var myAnim     = g.add(param, 'Animations', ["Idle", "Walk", "Jump"]);
    var showPlayer = g.add(param, 'showModel');

    var myColor     = l.addColor(param, 'ColorLight');
    var myIntensity = l.add(param,'Intensity').min(0).max(1).step(0.1);

    showPlayer.onChange(function (params) {
        if(params==false)
            scene.remove(modPlayer);
        else
            scene.add(modPlayer);
    });

    myPlayer.onChange(function(params) {
        scene.remove(modPlayer);
        console.log(params);

        loadModel_objectModelAndMtl("./src/Modelos/OBJ/personaje/"+params+"/",params,true);


    });
}

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}