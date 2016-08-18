import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
import cors from 'koa-cors';
import { Server } from 'http';
import IO from 'socket.io';
import mongo from 'mongodb';
import { init as initLists } from './lists';
import { init as initTasks } from './tasks';

const app = koa();
const router = koaRouter();
const server = Server(app.callback());
const io = new IO(server);

app.use(bodyParser());
app.use(cors());

app.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

app.use(function* (next) {
  this.mongo = {
    db: yield mongo.connect('mongodb://localhost:27017/todo'),
  };
  yield next;
  this.mongo.db.close();
});

app.use(function* (next) {
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log(`${Date.now()}::${this.method} ${this.url} ${ms}ms`);
});

initLists(router);
initTasks(router);

app.use(router.routes());
app.use(router.allowedMethods());

io.on('connection', socket => {
  console.log('connection.io!');
  socket.on('new', () => {
    console.log('new entry');
    io.emit('new');
  });
  socket.on('disconnect', () => {
    console.log('disconnect.io!');
  })
});

server.listen(3000, () => console.log('listening on port 3000'));
