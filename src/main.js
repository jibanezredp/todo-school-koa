import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
import cors from 'koa-cors';
import mongo from 'mongodb';
import { init as initLists } from './lists';
import { init as initTasks } from './tasks';

const app = koa();
const router = koaRouter();

app.use(bodyParser());
app.use(cors());

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

app.listen(3000, () => console.log('listening on port 3000'));
