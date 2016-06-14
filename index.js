//var service = require('./controllers/service.js');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
// middleware

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));

function *home() {
  this.body = 'Hello World';
}

function *show() {
   var data = yield parse(this);
   console.log(data);
   this.body = data;
}

// listen

app.listen(8082);
console.log('listening on port 8082');
