/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , morgan = require('morgan')
  , bootstrap = require('bootstrap-stylus')

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .use(bootstrap())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

function tinseth(og, boiltime, acid, grams, liters) {
  var fg = 1.65 * Math.pow(0.000125, og - 1)
  var ft = (1 - Math.pow(Math.E, -0.04 * boiltime)) / 4.15
  var utilization = fg * ft
  var aau = ((acid / 100) * grams * 1000) / liters
  return utilization * aau
}

function asArray(val) {
  return Array.isArray(val) ? val : [val]
}

app.get('/calc', function (req, res) {
  var volume = req.query.volume.length === 0 ? 0 : Number(req.query.volume)
  var og = req.query.og.length === 0 ? 0 : Number(req.query.og)
  var whops = req.query.weighthops.length === 0 ? [] : asArray(req.query.weighthops).map((v) => Number(v))
  var acids = req.query.acid.length === 0 ? [] : asArray(req.query.acid).map((v) => Number(v))
  var boiltimes = req.query.boiltime.length === 0 ? [] : asArray(req.query.boiltime).map((v) => Number(v))
  
  var calcs = whops.map((v, i) => tinseth(og, boiltimes[i], acids[i], whops[i], volume))
  res.json({
    "total" : calcs.reduce((p, c) => p + c, 0).toFixed(2),
    "calcs" : calcs.map(v => v.toFixed(2))
  })
})

app.get('/', function (req, res) {
  res.render('index', {title : 'Home'})
})
app.listen(3000)

