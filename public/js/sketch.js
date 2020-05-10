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

    var randomEf = Math.floor(Math.random() * 100) + 1;

    r = random(255); 
    g = random(100,200);
    b = random(100);

    frameRate(1/5);
}

function draw() {
    loadPixels()
    var imgData = {data: pixels, width: 800, height: 600};
    randomGlitch(imgData);
    datachannel.send(JSON.stringify({
		kind: 'imageDOM',
		path: imgB.src,
	}));
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

}
