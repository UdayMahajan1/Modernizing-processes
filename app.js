const express = require('express');
const bodyParser = require('body-parser');
const mime = require('mime-types');
const expressip = require('express-ip');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = require('./database/multer');
const { Readable } = require('stream');
const connectToMongoDB = require('./database/config');
const { Applicant } = require('./database/schema');
const { log } = require('console');
const publicDirectoryPath = path.join(__dirname, 'public');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToMongoDB();

app.use(expressip().getIpInfoMiddleware);

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.get('/', (req, res) => {
  res.sendFile('/jobs.html', { root: publicDirectoryPath });
});

app.get('/apply', (req, res) => {
  res.sendFile('/apply.html', { root: publicDirectoryPath });
});

app.post('/apply', upload.single('resume'), (req, res) => {
  console.log(req.file);
  const full_name = req.body.username;
  const email = req.body.email;
  const ph_no = req.body.phNum;
  const linked_in = req.body.linkedin;
  const work_exp = req.body.WorkExp
  const pdf = req.file.buffer;
  const contentType = mime.lookup(req.file.originalname);

  const readableFile = new Readable();
  readableFile.push(pdf);
  readableFile.push(null);

  let chunks = [];
  readableFile.on('data', (chunk) => {
    chunks.push(chunk);
  });

  readableFile.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    const contentType = mime.lookup(req.file.originalname);

    const applicant = new Applicant({
      full_name: full_name,
      email: email,
      ph_no: ph_no,
      linked_in: linked_in,
      work_exp: work_exp,
      pdf: {
        data: buffer,
        contentType: contentType
      }
    });

    try {
      var applicantSaved = await applicant.save()
      // comment out the line below if you want to see the json object that was saved
      // console.log(`The result is ${applicantSaved}`);
      res.sendFile('/success.html', { root: publicDirectoryPath });
    } catch (err) {
      console.log(err);
      res.sendFile('/failure.html', { root: publicDirectoryPath });
    }

  });

});

app.post('/failure', (req, res) => {
  res.redirect('/apply');
});

app.listen(3000, () => console.log("Server running on port 3000."));