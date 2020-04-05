
/////////////// AUX
var getParam = function (url) {
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  return query;
};
let param = getParam(window.location.href);
////////////////////////////////////////////////////

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(2, 3, 5);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101010);
document.body.appendChild(renderer.domElement);


var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(10);
scene.add(light);

var planeGeometry = new THREE.PlaneGeometry(40, 20, 1, 1);
var texture = new THREE.TextureLoader().load( param );
texture.wrapS = THREE.RepeatWrapping; 
texture.wrapT = THREE.RepeatWrapping;

var planeMaterial = new THREE.MeshLambertMaterial( { map: texture } );

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.material.side = THREE.DoubleSide;

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0,0,0);

scene.add(plane);

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
