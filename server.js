var express = require('express')
var bodyParser = require('body-parser')
var app = express()

// Configure express
app.use(express.static('public'))
app.use(bodyParser.json())

console.log('listening on port 3002')

app.get('/', function handleHomePage(req, res){
    res.send('index')
})

app.get('/api/address', function handleHomePage(req, res){
    res.json({'address': []})
})

app.listen(3002)
