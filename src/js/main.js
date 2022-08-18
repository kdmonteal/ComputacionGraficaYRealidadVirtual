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

var myObject = null,
    geometry = null,
    material = null
    allMyFigures = new Array(),
    countFigure = 0;

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
    scene.background = new THREE.Color(0x28DEFF);
    // Create Camera (3D)
    camera = new THREE.PerspectiveCamera(75, // Fov (campo de vision)
        window.innerWidth / window.innerHeight, // aspect (tamano pantalla)
        0.1, // near (Cercano)
        1000); // far (Lejano)
    // To renderer
    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // To Make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(2, 2.5, 0);
    controls.update();
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
    camera.position.z = 2;
    window.addEventListener('resize', redimensionar);
}
function getProperties() {
    var datos = document.querySelectorAll('input');
    createObjects('Cube', datos);
}

function createObjects(objectToCreate, datos) {
    material = new THREE.MeshBasicMaterial({ color: datos[3].value, wireframe: false});
    // Cubo, Torus, Cone
    switch (objectToCreate) {
        case 'Cube':
            geometry = new THREE.BoxGeometry(datos[0].value, datos[1].value, datos[2].value);
            countFigure++;
            break;
        case 'Torus':
            geometry = new THREE.TorusGeometry(10, 3, 16, 100);
            break;
        case 'Cone':
            geometry = new THREE.ConeGeometry(5, 20, 32);
            break;
        case 'Vector':
            const dir = calcularVector(10, 10, 10, 5, 2, 1);
            //normalize the direction vector (convert to vector of length 1)
            dir.normalize();

            const sum = dir.x + dir.y + dir.z;
            const raiz = Math.sqrt(sum);

            const origin = new THREE.Vector3(0, 0, 0);
            const length = raiz;

            const hex = 0xffff00;

            const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
            scene.add(arrowHelper);
            break;
    }
    myObject = new THREE.Mesh(geometry, material);
    myObject.name = "Figura"+countFigure;
    allMyFigures.push(myObject);
    console.log(allMyFigures);
    scene.add(myObject);
}
function calcularVector(pfx, pfy, pfz, pix, piy, piz) {
    const vectorx = pfx - pix;
    const vectory = pfy - piy;
    const vectorz = pfz - piz;
    return new THREE.Vector3(vectorx, vectory, vectorz);
}
function animate() {
    requestAnimationFrame(animate);
    //myCube.rotation.x += 0.01;
    //myCube.rotation.y += 0.01;
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}



