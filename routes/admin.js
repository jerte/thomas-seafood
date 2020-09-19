const express = require('express');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
const fileUpload = require('express-fileupload');

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL, 
	ssl: {
		rejectUnauthorized: false
	}
});

passport.use('local', new LocalStrategy(
	async function(username, password, done) {
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
}));

passport.serializeUser(function(user, done) {
	done(null, 1);
});
passport.deserializeUser(function(id, done) {
	done(null, 1);
});

var router = express.Router();

router.use(fileUpload());

router.get('/:page?/:subpage?', async(req, res) => {
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
				const d_q = await client.query('SELECT * FROM data where item_id=' +
									  			     '(SELECT id FROM data_items where name=\'' + i + '\')');
				data[i] = d_q.rows;
			}
			
			res.render('pages/base', {admin: true, access: req.user,
									  page: req.params.page, subpage: req.params.subpage, data: data});
	  	} else {
	  		console.log(index, req.params.page);
	  		res.render('pages/404');
	  	}
		
	 	client.release();
			
	} catch(err) {
		res.send("" + err);
	}
});

router.post('/login', 
	passport.authenticate('local', {successRedirect: '/admin'})
);

router.post('/add/:data_item?', async (req, res) => {
	try {
		const client = await pool.connect();
		var valuestr, name;
		var redirect = false;
		if(req.params.data_item=='image') {
		
			valuestr = '\'/images/' + req.body.item_name + '/' + req.files.img['name'] + '\',' +
					   '\'{ "page" : "' + req.body.item_name + '" }\')';
			var img = req.files.img;
			img.mv(path.dirname(__dirname) + '/static/images/' + req.body.item_name + '/' + req.files.img['name'], 
				function(err) { if(err) { console.log(err) }
			});
			name = 'images';
			redirect = true;
		} else {
			name = req.body.item_name;
			valuestr = req.body.name + ', \'{}\'' + ')';
		}
		console.log('SELECT id FROM data_items WHERE name=\'' + name + '\'');	

		const item_id = await client.query('SELECT id FROM data_items WHERE name=\'' + name + '\'');	
			
		valuestr = '(' + item_id.rows[0]['id'] + ', ' + valuestr;
		
		console.log('INSERT into data(item_id, name, json) VALUES ' + valuestr);

		const query = await client.query('INSERT into data(item_id, name, json) VALUES ' + valuestr);
		
		if(redirect) {
			res.redirect('/admin/' + req.body.item_name);
		} else {
			res.send('yes');
		}
		client.release();
	} catch(err) {
		console.log("Error: " + err);
	}
});

module.exports = router;

