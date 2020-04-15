/////////////// AUX
var getParam = function (url) {
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  return query;
};
let param = getParam(window.location.href);
////////////////////////////////////////////////////

var gui, guiData;
function addGuiControls(){
  gui = new dat.GUI();

  guiData = {
    "steppp" : 1.,
    "deltaSteppp":5.,
    "chi": .5,
    "deltaChi": 6.,
    "sharpAmnt": 0.2,
    "deltaSharpAmnt":4.,
    "weight" : 10.,
    "iFact" : 10.,
  };

  gui.add(guiData, 'steppp', 0., 10.).step(.5);
  gui.add(guiData, 'deltaSteppp', 1., 10. );

  gui.add(guiData, 'chi', 0, 2.).step(0.001);
  gui.add(guiData, 'deltaChi', 1., 10.);
  gui.add(guiData, 'weight', 0, 20.);

  gui.add(guiData, 'sharpAmnt', 0, 1.).step(0.001);
  gui.add(guiData, 'deltaSharpAmnt', 1. ,10.);

  gui.add(guiData, 'iFact', 0, 10.);
}
addGuiControls();

var scene,camera,renderer,light,controls;
function setupMainScene(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(2, 3, 5);
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x101010);
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.setScalar(10);
  scene.add(light);
}
setupMainScene();

var planeGeometry, texture;
function loadImageTexture(){
   planeGeometry = new THREE.PlaneGeometry(40, 30, 1, 1);
   texture = new THREE.TextureLoader().load( param );
  texture.wrapS = THREE.RepeatWrapping; 
  texture.wrapT = THREE.RepeatWrapping;
}
loadImageTexture();

//var planeMaterial = new THREE.MeshLambertMaterial( { map: texture } );


var material, plane, uniforms;
function initMainScene(){
  uniforms = {
    time: { type: "f", value: 1.0 },
    steppp: { type: "f", value: guiData.stepp },
    deltaSteppp: { type: "f", value: guiData.deltaSteppp },
    chi: { type: "f", value: guiData.chi },
    deltaChi: { type: "f", value: guiData.deltaChi },
    sharpAmnt: { value: guiData.sharpAmnt },
    deltaSharpAmnt: { type: "f", value: guiData.deltaSharpAmnt },
    weight: { type: "f", value: guiData.weight },
    tex0: {value: texture},
    iFact: {value: guiData.iFact}
  }
  
  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });
  
  plane = new THREE.Mesh(planeGeometry, material);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0,0,0);
  plane.receiveShadow = true;
  plane.material.side = THREE.DoubleSide;
  scene.add(plane);
}

initMainScene();

render();
function render() {

  var timeU =performance.now() * 0.00005; 
  uniforms.steppp.value = guiData.steppp +guiData.deltaSteppp; 
  uniforms.time.value = timeU;

  uniforms.deltaChi.value = Math.sin(timeU/guiData.deltaChi);
  uniforms.deltaSteppp.value = Math.sin(timeU/guiData.deltaSteppp);
  uniforms.deltaSharpAmnt.value = Math.sin(timeU/guiData.deltaSharpAmnt);

  uniforms.chi.value = guiData.chi + uniforms.deltaChi.value;
  uniforms.sharpAmnt.value = guiData.sharpAmnt + uniforms.deltaSteppp.value;
  uniforms.iFact.value = guiData.iFact + uniforms.deltaSharpAmnt.value;
  
  uniforms.weight.value = guiData.weight;
  requestAnimationFrame(render);
  renderer.render(scene, camera);


}
