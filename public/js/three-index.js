var w =window.innerWidth,
h = window.innerHeight;

////////////// AUX
var getParam = function (url) {
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  return query;
};
let param = getParam(window.location.href);
////////////////////////////////////////////////////

var steppp = 1.;
var deltaStepp= 5;
var chi =  2;
var deltaChi = 6.;
var weight = 5;
var sharpAmnt = 0.5;
var deltaSharpAmnt = 6.;
var iFact = 5.;

var guiData = {
  "preset": "default",
  "remembered": {
      "default": {
      "0":{}
    }
  }
}

guiData =  {
  "steppp" : 1.,
  "deltaSteppp":5.,
  "chi": .5,
  "deltaChi": 6.,
  "sharpAmnt": 0.2,
  "deltaSharpAmnt":4.,
  "weight" : 10.,
  "iFact" : 10.,
};


var gui, guiData;
function addGuiControls(){
  gui = new dat.GUI();
  //gui.remember(this)

  gui.add(guiData, 'steppp', -10., 10.).step(.5);
  gui.add(guiData, 'deltaSteppp', 1., 10. );

  gui.add(guiData, 'chi', 0, 5.).step(0.001);
  gui.add(guiData, 'deltaChi', 1., 10.);
  gui.add(guiData, 'weight', 0, 20.);

  gui.add(guiData, 'sharpAmnt', 0, 1.).step(0.001);
  gui.add(guiData, 'deltaSharpAmnt', 1. ,10.);
  gui.add(guiData, 'iFact', 0, 10.);

}


var scene,camera,renderer,light,controls;
function setupMainScene(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(2, 3, 5);
  renderer = new THREE.WebGLRenderer({});

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x101010);
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.setScalar(10);
  scene.add(light);
}

var bufferScene ,ping ,pong, renderTargetParams; 
function setupBufferScene(){
    bufferScene = new THREE.Scene();
    renderTargetParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearMipMapLinearFilter, 
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    };  
    
    ping = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
    pong = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
    
}


var planeGeometry, texture;
function loadImageTexture(){
   planeGeometry = new THREE.PlaneGeometry(40, 30, 1, 1);
   texture = new THREE.TextureLoader().load( param );
  texture.wrapS = THREE.RepeatWrapping; 
  texture.wrapT = THREE.RepeatWrapping;
}

var bufferUniforms, bufferMaterial, plane, bufferObject;
function initBufferScene(){
    bufferUniforms = {
      texture: { type : 't', value : pong.texture },
      time: { type: "f", value: 1.0 },
      steppp: { type: "f", value: guiData.stepp },
      deltaSteppp: { type: "f", value: guiData.deltaSteppp },
      chi: { type: "f", value: guiData.chi },
      deltaChi: { type: "f", value: guiData.deltaChi },
      sharpAmnt: { value: guiData.sharpAmnt },
      deltaSharpAmnt: { type: "f", value: guiData.deltaSharpAmnt },
      weight: { type: "f", value: guiData.weight },
      tex0: {value: texture},
      iFact: {value: guiData.iFact},
      resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight ) },
    }
    
    
    bufferMaterial = new THREE.ShaderMaterial({
        uniforms : bufferUniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });
    
    plane = new THREE.PlaneGeometry( 200, 200);
    bufferObject = new THREE.Mesh( plane, bufferMaterial );
    bufferScene.add(bufferObject);
}


var material,quad,geom;
function initMainScene(){
  material = new THREE.ShaderMaterial({
    uniforms : {
      texture: { type : 't', value : ping.texture },
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'finalShader' ).textContent
});
  //  finalMaterial =  new THREE.MeshBasicMaterial({map: ping.texture});
    geom = new THREE.PlaneBufferGeometry( 2, 2);
    quad = new THREE.Mesh( geom, material );
    scene.add(quad);
}

var timeU;
function render() {

  timeU =performance.now() * 0.005; 
  bufferMaterial.uniforms.steppp.value = guiData.steppp +guiData.deltaSteppp; 
  bufferMaterial.uniforms.time.value = timeU;

  bufferMaterial.uniforms.deltaChi.value = Math.sin(timeU/guiData.deltaChi);
  bufferMaterial.uniforms.deltaSteppp.value = Math.sin(timeU/guiData.deltaSteppp);
  bufferMaterial.uniforms.deltaSharpAmnt.value = Math.sin(timeU/guiData.deltaSharpAmnt);

  bufferMaterial.uniforms.chi.value = guiData.chi 
  //+ bufferMaterial.uniforms.deltaChi.value;
  bufferMaterial.uniforms.sharpAmnt.value = guiData.sharpAmnt 
  //+ bufferMaterial.uniforms.deltaSteppp.value;
  bufferMaterial.uniforms.iFact.value = guiData.iFact
  // + bufferMaterial.uniforms.deltaSharpAmnt.value;
  
  bufferMaterial.uniforms.weight.value = guiData.weight;
  requestAnimationFrame(render);

  for (let index = 0; index < 8; index++) {
    // //Draw ping to buffer
    renderer.setRenderTarget(ping);
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null);
    renderer.clear();
        
    //Swap ping and pong
    let temp = pong;
    pong = ping;
    ping = temp;

    //Update uniforms
    quad.material.uniforms.texture.value = ping.texture;
    bufferMaterial.uniforms.texture.value=pong.texture;
  }
   
    
  renderer.render(scene, camera);
}

loadImageTexture();
setupMainScene();
setupBufferScene();
initBufferScene();
initMainScene();

addGuiControls();
render();