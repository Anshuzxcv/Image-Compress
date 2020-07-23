const express = require('express');
const fileUpload = require('express-fileupload');
const fse = require('fs-extra');
const async = require('async');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

const app = express();
app.use(fileUpload());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  req.files.file.mv(
    __dirname + '/images/' + req.files.file.name.toLowerCase(),
    function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('file is uploaded successfully');

        async function comp() {
          const compressedFiles = await imagemin(['images/*.{jpg,png}'], {
            destination: 'images/compressed',
            plugins: [imageminWebp({ quality: 10 })],
          });
          // await fse.unlink(__dirname + "/images/" + req.files.file.name, err => {
          //    if (err) return console.error(err)
          //    console.log('success!');
          // })

          console.log(compressedFiles[0].destinationPath);
          //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
        }
        comp();
      }
      res.sendFile(__dirname + '/index.html');
    }
  );

  // console.log(req.files);
});

app.listen('300', function () {
  console.log('port is running at port 300');
});
