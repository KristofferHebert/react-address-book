var express = require('express')
var bodyParser = require('body-parser')
var address = require('./db')

var app = express()

// Configure server
app.use(express.static('public'))
app.use(bodyParser.json())

// Configure routes
app.get('/', function handleHomePage(req, res){
    res.send('index')
})

app.get('/api/address', function handleHomePage(req, res){
    res.json({'address': address})
})

// Launch server
console.log('listening on port 3002')
app.listen(3002)
