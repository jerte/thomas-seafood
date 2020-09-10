const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var passport = require('passport');
const fileUpload = require('express-fileupload');
var session = require('express-session');

var admin_active = true;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, '/node_modules/ejs/')));
app.use(favicon(path.join(__dirname, 'favicon/favicon.ico')));

app.use(session({ secret: "cats" }));

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

if(admin_active) {
	var admin = require('./routes/admin');
	app.use('/admin/', admin);
}

var web = require('./routes/web');
app.use('/', web);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
