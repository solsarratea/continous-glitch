const express = require("express");
const app = express();
const fileupload = require('express-fileupload')


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(
    fileupload()
    );

app.use(express.static("js")); //Serves resources from public folder
app.use(express.static("media"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/continous", (request, response) => {
    response.sendFile(__dirname + "/views/continous.html");
 });

app.post('/saveImage', (req, res) => {
    const image = req.files.image;
    const fileName = image.name;
    const path = __dirname + '/media/' + fileName
  
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
      res.end(JSON.stringify({ status: 'success', path: '/' + fileName }))
    })
  })

// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
