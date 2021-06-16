const express = require('express');
const fs = require('fs')
const router = require('router');
const multer = require("multer");
const app = express(),
      bodyParser = require("body-parser");
      port =  process.env.PORT || 80;

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://host.nxt.blackbaud.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api', router);

app.get('/fs/datesTaken', (req, res) => {
  const year = req.query.year
  const month = req.query.month
try {
  const directories =
  fs.readdirSync(`../dates/${year}/${month}`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)  
    res.send(directories);
} catch {
  res.send([])
}
});

app.get('/fs/ls', (req, res) => {
  const everything = 
  fs.readdirSync(__dirname)
  res.send(everything)
});


var storage = multer.memoryStorage();
var uploadMem = multer({ storage: storage });

app.post("/fs/upload", uploadMem.single("image"), (req, res) => {
  const date = req.query.date
  const month = req.query.month
  const year = req.query.year
  const body = req.body
  try {
    fs.mkdirSync(`../dates/${year}/${month}/${date}`, { recursive: true })
    fs.writeFileSync(`../dates/${year}/${month}/${date}/data.txt`, `
    Owner Name ${body.ownerName}\n
    City ${body.city}\n
    State ${body.state}\n
    Email ${body.email}\n
    Dog Name ${body.dogName}\n
    IsRescue ${body.isRescue}\n
    Caption ${body.caption}
    `)
    fs.writeFileSync(`../dates/${year}/${month}/${date}/` + req.file.originalname , req.file.buffer)
    console.log(" file mem  uploaded");
    res.send("file mem upload success");
  } catch {
    
    fs.rmdirSync(`../dates/${year}/${month}/${date}/`, { recursive: true });
    res.send("Error, deleted files");
  }

})

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
