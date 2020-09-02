const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg')
var admin_active = true

var cstr = 'postgres://ljjwpujdbsajfh:586cb8e8b28d2303f5e9489bdfa4c4f18ad92b809385d298a326aa048c49d917@ec2-50-16-198-4.compute-1.amazonaws.com:5432/d2bbf1k9p9ojr9'

const pool = new Pool({
	connectionString: cstr, 
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

app.get('/admin_auth/:user/:pass', async(req, res) => {
	if(admin_active) {
		try {
			const client = await pool.connect();
			const is_admin = await client.query('SELECT * FROM admin where u=\'' + req.params.user + 
							 '\'' + ' AND p=\''+ req.params.pass + '\'');
			if(is_admin.rows.length) {
				res.send("auth");
			} else {
				res.send("no auth");
			}
			
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
	  } else if(req.params.page == 'admin' && admin_active) {
	  	
		if(!req.params.subpage) {
			data['admin'] = 'home';
		} else {
			data['admin'] = req.params.subpage;
		}
	  
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
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
