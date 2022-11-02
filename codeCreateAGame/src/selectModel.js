var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    clock = null;

function mySelecyPlayer() {
    initScene();
    animate();
}
function initScene() {
    initBasicElements(); // Scene, Camera and Render
    createFistModel("./modelos/soldier/","soldado.mtl","soldado.obj");
}
function initBasicElements() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("screen3D_model") });
    clock = new THREE.Clock();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(6.12, 4.72, 6.78);

    controls.update();

    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    renderer.setSize(300, 300);
    // document.body.appendChild(renderer.domElement);
}
function createFistModel(generalPath, pathMtl, pathObj) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function (object) {

            scene.add(object);
            // object.scale.set(0.1, 0.1, 0.1);

            // object.position.y = 0;
            // object.position.x = 5;

        });

    });
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}