var socket;
var imgB;

function preload(){
    imgB = loadImage(img.src);
}

function setup() {
    var canvas = createCanvas(800,600);
    canvas.position(0,0);
    canvas.style("z-index",-2);
    background(0);

    image(imgB, 0, 0);
    loadPixels();
 
    socket = io.connect('http://localhost:8080');
    console.log(socket)
    socket.on('image',
            function(path){
                loadImage(path, imgB => {
                    image(imgB, 0, 0);
                  });
            })
    frameRate(1/5);
    }

function draw() {
    loadPixels()
    var imgData = {data: pixels, width: 800, height: 600};
    randomGlitch(imgData);
    pixels = imgData.data;
    updatePixels();
}

function mouseDragged() {
  // Draw some wh   ite circles
  fill(255);
  noStroke();
  ellipse(mouseX-100,mouseY,20,20);
  sendmouse(mouseX-100,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  var data = {
    x: xpos,
    y: ypos
  };

  socket.emit('mouse',data);
}
