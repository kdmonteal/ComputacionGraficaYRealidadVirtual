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
    countFigure = 0,
    myObjectTransform = null;

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
    scene.background = new THREE.Color(0x000);
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

    // Create Object with images texture
    const light = new THREE.AmbientLight( 0xfff,1); // soft white light
    scene.add( light );

    const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
    pointLight.position.set( 0, 1.5, 2 );
    scene.add( pointLight );

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // -- Basic --
    /*const material = new THREE.MeshBasicMaterial( {color: 0xff0000,
                                                    wireframe: false,
                                                    transparent: true,
                                                    opacity:1
                                                    } );*/
    // -- Normales --
    /*const material = new THREE.MeshNormalMaterial({color: 0xff0000,
                                                    wireframe: false,
                                                    transparent: true,
                                                    opacity:1
                                                });*/
    // -- Phong Material --
    /*const material = new THREE.MeshPhongMaterial({color: 0xff00ff,
                                                 specular: 0xff0000,
                                                 map: new THREE.TextureLoader().load('./src/img/face3.jpg')}); */
    // -- MeshLambertMaterial --  
    /*const material = new THREE.MeshLambertMaterial({color: 0xff00ff,
                                                    emissive: 0xff00ff,
                                                    emissiveIntensity:0.3,
                                                    map: new THREE.TextureLoader().load('./src/img/face3.jpg')});*/
    const material = new THREE.MeshStandardMaterial({color: 0xff00ff,
                                                    roughness:0.4,
                                                    metalness:0.2,
                                                    map: new THREE.TextureLoader().load('./src/img/face3.jpg')

                                            });
    
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    
    // ******************************
}
function getProperties() {
    var datos = document.querySelectorAll('input');
    createObjects('Cube', datos);
}
function createOptions() {
    let mySelect = document.getElementById("objects");
    for (let i = 0; i < allMyFigures.length; i++) {
        var option = document.createElement('option');
        option.setAttribute("value", i);
        option.innerHTML = allMyFigures[i].name;
    }
    mySelect.appendChild(option);
}
function transformations(action) {
    let valuesTrans = document.querySelectorAll('.transF');
    var e = document.getElementById("objects");
    var value = e.value;

    objTransform = allMyFigures[value];

    switch (action) {
        case 'Translate':
            objTransform.position.set(valuesTrans[0].value, valuesTrans[1].value, valuesTrans[2].value);
            break;
        case 'Rotate':
            console.log("rotate");
            break;
        case 'Scale':
            console.log("scale");
            break;
    }
}
function createObjects(objectToCreate, datos) {
    material = new THREE.MeshBasicMaterial({ color: datos[3].value, wireframe: false });
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
    myObject.name = objectToCreate + " " + countFigure + " / " + datos[3].value;
    myObject.position.set(getRndInteger(-20, 20), datos[1].value / 2, getRndInteger(-20, 20));
    allMyFigures.push(myObject);
    console.log(allMyFigures);
    scene.add(myObject);

    if (countFigure > 0) {
        createOptions();
        document.getElementById('transform').className = "dropdown-item";
        document.getElementById('rotate').className = "dropdown-item";
        document.getElementById('scale').className = "dropdown-item";
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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