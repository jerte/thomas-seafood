const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var favicon = require('serve-favicon')

var app = express()

app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist/')))
app.use(express.static(path.join(__dirname, '/node_modules/ejs/')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req,res) => { 
	res.render('pages/base', {page:'home'});
})

app.get('/seafood', (req,res) => {
	res.render('pages/base', {page:'seafood'});
})

app.get('/about', (req,res) => {
	res.render('pages/base', {page:'about'});
})

app.get('/contact', (req,res) => {
	res.render('pages/base', {page:'contact'});
})

app.use(express.static(path.join(__dirname, 'static')))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
