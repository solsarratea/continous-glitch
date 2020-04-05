var socket;
var imgB, r,g,b;

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

    var randomEf = Math.floor(Math.random() * 100) + 1;

    socket.on('image',
            function(path){
                var offset = Math.random();
                loadImage(path, imgB => {
                    let dx = mouseX - imgB.width / 2 - offset;
                    tint(255, 127);
                    image(imgB, offset, 0);
                  });
            })
    r = random(255); 
    g = random(100,200);
    b = random(100);

    socket.on('mouse',
        function(data){
            fill(r,g,b)
            noStroke();
            ellipse(data.x,data.y,20,20);
    })

    frameRate(1/5);
    }

function draw() {
    loadPixels()
    var imgData = {data: pixels, width: 800, height: 600};
    randomGlitch(imgData);
    socket.emit('imageDOM',imgB.src)
    pixels = imgData.data;
    updatePixels();
}

function mouseDragged() {
  fill(r,g,b);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  sendmouse(mouseX,mouseY);
}

function sendmouse(xpos, ypos) {

  var data = {
    x: xpos,
    y: ypos
  };

  socket.emit('mouse',data);
}
