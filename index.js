const express = require('express');
var session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { Pool } = require('pg');
var admin_active = true;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL, 
	ssl: {
		rejectUnauthorized: false
	}
});

var favicon = require('serve-favicon');

var app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, '/node_modules/ejs/')));
app.use(favicon(path.join(__dirname, 'favicon/favicon.ico')));

app.use(session({ secret: "cats" }));

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use('local', new LocalStrategy(
	async function(username, password, done) {
	if(admin_active) {
		try {
			const client = await pool.connect();
			const admins = await client.query('SELECT username FROM admin');
			if(admins.rows.map(x=>x['username']).includes(username)) {
				const admin_pass = await client.query('SELECT password FROM admin WHERE username=\'' + 
												  username + '\'');
			
				if(admin_pass.rows[0]['password']==password) {
					return done(null, "admin");
				} else {
					return done(null, false, { message: 'Incorrect password' });
				}
			} else {
				return done(null, false, {message: 'Incorrect username' });
			}

		} catch(err) {
			return done(err);
		}
	}
}));

passport.serializeUser(function(user, done) {
	done(null, 1);
});
passport.deserializeUser(function(id, done) {
	done(null, 1);
});
app.get('/home', (req,res) => res.redirect('/'));

app.post('/admin/login', 
	passport.authenticate('local', {successRedirect: '/admin'})
);

app.post('/admin/add', async (req, res) => {
	if(admin_active) {
		try {
			const client = await pool.connect();
			const item_id = await client.query('SELECT id FROM data_items WHERE name=\'' + req.body.item_name + '\'');
			console.log('INSERT INTO data(item_id, name, json) VALUES (' +  item_id.rows[0]['id'] + 
						  ', \'' + req.body.name + '\', \'{}\')');
			
			const query = await client.query('INSERT INTO data(item_id, name, json) VALUES (' +  item_id.rows[0]['id'] + 
						  ', \'' + req.body.name + '\', \'{}\')');
				
			res.send('yes');
		} catch(err) {
			console.log("Error: " + err);
		}
	}
});

app.get('/admin/:page?/:subpage?', async(req, res) => {
	if(admin_active) {
			try {
				const client = await pool.connect();
				const pages = await client.query('SELECT * FROM pages');

				var data = {};

				if(!req.params.page) {
					req.params.page = 'home';
				}

		  		var index = pages.rows.map(x=>x['name']).indexOf(req.params.page);
	  
	  			if(index >= 0) {
					for(var i of pages.rows[index]['data_req'].split(" ")) {
						const q = await client.query('SELECT * FROM data where item_id=' +
									  			     '(SELECT id FROM data_items where name=\'' + i + '\')');
						data[i] = q.rows;
					}
	
					res.render('pages/base', {admin: true, access: req.user, 
								page: req.params.page, subpage: req.params.subpage, data: data});
	  			} else {
	  				console.log(index, req.params.page);
	  				res.render('pages/404');
	  			}
		
	 		 	client.release();
			
			} catch(err) {
				res.send(err);
			}
	} else {
		res.render('pages/404');
	}

});

app.get('/:page?/:subpage?', async (req,res) => {
	try {
	  
	  const client = await pool.connect();
	  const pages  = await client.query('SELECT * FROM pages');
	  
	  var data = {};
	  
	  if(!req.params.page) {
	  	req.params.page = 'home';
	  }

	  var index = pages.rows.map(x=>x['name']).indexOf(req.params.page);
	  
	  if(index >= 0) {
		for(var i of pages.rows[index]['data_req'].split(" ")) {
			const q = await client.query('SELECT * FROM data where item_id=' +
										   '(SELECT id FROM data_items where name=\'' + i + '\')');
			data[i] = q.rows;
		}
	
		res.render('pages/base', {page: req.params.page, subpage: req.params.subpage, data: data});
	  } else {
	  	console.log(index, req.params.page);
	  	res.render('pages/404');
	  }
	  client.release();
	  
	} catch (err) {
	  res.send("E: " + err);
	}


})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
