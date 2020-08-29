const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.enc.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

var favicon = require('serve-favicon')

var app = express()

app.use(favicon(path.join(__dirname, 'favicon/favicon.ico')))
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist/')))
app.use(express.static(path.join(__dirname, '/node_modules/ejs/')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'static')))
app.get('/home', (req,res) => res.redirect('/'));

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
		res.render('pages/base', {page: req.params.page, subpage: req.params.page, data: data});
	  } else {
	  	console.log(pages.rows);
	  	console.log(index, req.params.page);
	  	res.render('pages/404');
	  }

	  client.release();
	} catch (err) {
	  res.send("E: " + err);
	}


})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
