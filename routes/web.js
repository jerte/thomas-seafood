const express = require("express");
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL, 
	ssl: {
		rejectUnauthorized: false
	}
});



router.get('/home', (req,res) => res.redirect('/'));

router.get('/:page?/:subpage?', async (req,res) => {
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

});

module.exports = router;
