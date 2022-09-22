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
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 4);
    document.body.appendChild(renderer.domElement);
    // To Make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(2, 2.5, 0);
    controls.update();
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Make Adds
    scene.add(camera);
    camera.position.z = 2;
    window.addEventListener('resize', redimensionar);

    // Create Object with images texture
    const light = new THREE.AmbientLight(); // soft white light
    scene.add(light);

    const pointLight = new THREE.PointLight(0xfff, 3, 100);
    pointLight.position.set(0, 1.5, 2);
    scene.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    //scene.add(pointLightHelper);

    // populate the scene
    let geo = new THREE.BoxBufferGeometry(10, 10, 10)
    let mat = new THREE.MeshLambertMaterial({
        color: "red"
    });

    let tex = new THREE.TextureLoader().load("./src/img/myGround.jpg");
    tex.anisotropy = 32;
    tex.repeat.set(500, 500);
    tex.wrapT = THREE.RepeatWrapping;
    tex.wrapS = THREE.RepeatWrapping;
    geo = new THREE.PlaneBufferGeometry(10000, 10000);
    mat = new THREE.MeshLambertMaterial({
    map: tex
    });
    mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -5, 0);
    mesh.rotation.set(Math.PI / -2, 0, 0);
    scene.add(mesh);


    loadModel_objAndMtl();
}
// To load (Obj and Mtl)

// "./src/models/castillo/"      "castle.obj"

function loadModel_objAndMtl() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath("./src/models/castillo/");
    mtlLoader.setPath("./src/models/castillo/");
    mtlLoader.load("castle.mtl", function (materials) {

        materials.preload();

    });

    
    var objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath("./src/models/castillo/");
    objLoader.load("castle.obj", function (object) {

        scene.add(object);
        object.scale.set(3,3,3);
    });
}

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}