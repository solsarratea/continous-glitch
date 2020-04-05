const express = require("express");
const app = express();
const fileupload = require('express-fileupload');
var short = require('short-uuid');

app.use(fileupload());

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/media'))

app.use(express.static(__dirname +'/node_modules/three'))
app.use(express.static(__dirname +'/node_modules/three/build'))
app.use(express.static(__dirname +'/node_modules/three/examples/jsm/controls'));

app.get("/continous", (request, response) => {
  response.sendFile(__dirname + "/public/continous.html");
});

app.get("/cca", (request, response) => {
  response.sendFile(__dirname + "/public/automata.html");
});

// listen for requests :)
const server = app.listen(8080, () => {
  console.log("Your app is listening on port " + server.address().port);
});


// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

io.sockets.on('connection',
  function (socket) {
  
    console.log("New client: " + socket.id);
  
    socket.on('mouse',
      function(data) {
        socket.broadcast.emit('mouse', data);
      }
    );

    socket.on('image',
      function(data) {
        socket.broadcast.emit('image', data);
    }
  );

  socket.on('imageDOM',
      function(data) {
        socket.broadcast.emit('imageDOM', data);
    }
  );

    socket.on('disconnect', function() {
          console.log("Client has disconnected");
    });
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);



app.post('/saveImage', (req, res) => {
  const image = req.files.image;
  const fileName = short.generate();
  const path = __dirname + '/public/media/' + fileName
  

  image.mv(path, (error) => {
    if (error) {
      console.error(error)
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({ status: 'error', message: error }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    
    res.end(JSON.stringify({ status: 'success', path: fileName }))
  })
})

app.get('/loadImage/:fileName',(req,res)=>{
  var fileName = req.params.fileName;
  console.log(fileName)
  io.sockets.emit('image',fileName)
})
