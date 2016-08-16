import koa from 'koa';

const app = koa();

// logger
app.use(function* (next) {
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log(`${Date.now()}::${this.method} ${this.url} ${ms}ms`);
});

// response
app.use(function* () {
  this.body = 'Hello World';
});

app.listen(3000);
console.log('listening on port 3000');
