var express = require("express");
var login = require('./routes/loginroutes');
//var upload = require('./routes/fileroutes');
var dashboardwidgets = require("./routes/dashboardwidgets");
var loaddata = require("./routes/loaddata");
var path = require("path");

var AWS = require('aws-sdk');

//AWS.config.region = process.env.REGION

var sns = new AWS.SNS();
var ddb = new AWS.DynamoDB();

console.log(sns)
console.log(ddb)

var bodyParser = require('body-parser');
//var mongo = require('mongodb');

const cookieParser = require('cookie-parser');
/*
Module:multer
multer is middleware used to handle multipart form data
*/
//var multer = require('multer');

// A random key for signing the cookie


//var multerupload = multer({ dest: 'fileprint/' })
var app = express();

app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//express server

app.use(express.static(path.join(__dirname, 'build')));

if(process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
   	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}


var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login);
router.post('/checkuser',dashboardwidgets.checkuser);
router.post('/checkuserlogin',login.checkuserlogin);
router.post('/updatedatawidgets',dashboardwidgets.updatedata);
router.post('/deletedatawidgets',dashboardwidgets.deletewidget);
router.post('/loaddata',loaddata.loaddata);
router.post("/updatedata",loaddata.updatedata);
router.get("/getdata", loaddata.getdata);
router.get("/getdatawidgets", dashboardwidgets.getdata);
//route to handle file printing and listing
//router.post('/fileprint',multerupload.any(),upload.fileprint);
//router.get('/fileretrieve',upload.fileretrieve);
app.use('/api', router);
app.listen(4000);