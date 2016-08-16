var express = require('express');
var app = express();
var multer = require('multer');
var ext = require('file-extension');
var config = require('./Config');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var s3 = new aws.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});


var storage = multerS3({
  s3: s3,
  bucket: 'platzigram-ddesna',
  acl: 'public-read',
  metadata: function(req, file, cb){    
    cb(null, {fieldName: file.fieldname})
  },
  key: function(req, file, cb){
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
})

var upload = multer({ storage: storage }).single('picture');

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index', {title: 'Platzigram'})
})

app.get('/signup', function(req, res){
  res.render('index', {title: 'Platzigram - Signup'})
})

app.get('/signin', function(req, res){
  res.render('index', {title: 'Platzigram - Signin'})
})

// API
app.get('/api/pictures', function(req, res){
  var pictures = [
		{
			user: {
				username: 'ddesna',
				avatar: 'http://lorempixel.com/50/50/'
			},
			url: 'http://lorempixel.com/400/400/',
			likes: 0,
			liked: false,
			createdAt: new Date().getTime()
		},
		{
			user: {
				username: 'ddesna',
				avatar: 'http://lorempixel.com/50/50/'
			},
			url: 'http://lorempixel.com/400/400/',
			likes: 1,
			liked: false,
			createdAt: new Date().setDate(new Date().getDate() -10)
		}
	];
  res.status(200).send(pictures);
});

app.post('/api/pictures', function(req, res){
  upload(req, res, function(err){
    if(err) {
      console.log(err);
      return res.status(500).send("Error uploading file");
    }else{
      res.status(200).send('File uploaded');
    }
  })
})

app.listen(3000, function(err){
  if(err) return console.log('Hay un error', process.exit(1));

  console.log('Servidor corriendo');
})
