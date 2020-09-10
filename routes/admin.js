const express = require('express');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
});

router.post('/login', 
	passport.authenticate('local', {successRedirect: '/admin'})
);

router.post('/add', async (req, res) => {
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
});

router.post('/add-pic', async (req,res) => {
	try {
		const client = await pool.connect();
//		const item_id = await client.query('SELECT id from img_items WHERE name=\'' + req.body.item_name + '\'');
		console.log(req.files.fileinput['data']);
//		const query = await client.query('INSERT INTO images

		client.release();
	} catch(err) {
		console.log(""+ err);
	}
});

module.exports = router;

