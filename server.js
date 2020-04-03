const express = require("express");
const app = express();
const fileupload = require('express-fileupload');
var short = require('short-uuid');


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(
    fileupload()
    );

app.use(express.static("public"))
app.use(express.static("public/media"))

app.get("/continous", (request, response) => {
  response.sendFile(__dirname + "/public/continous.html");
});

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

// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
