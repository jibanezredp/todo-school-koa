import mongo from 'mongodb';

const url = 'mongodb://localhost:27017/todo';

export const init = (router) => {

  router.get('/todo/tasks', function* () {
    const db = yield mongo.connect(url);
    const tasks = yield db.collection('tasks').find().toArray();
    tasks.forEach(task => task.id = task._id);
    this.type = 'json';
    this.status = 200;
    this.body = tasks;
    db.close();
  });

  router.post('/todo/tasks', function* () {
    const { listId, description } = this.request.body.task;
    const db = yield mongo.connect(url);
    yield db.collection('tasks').insertOne({ listId, description });
    const tasks = yield db.collection('tasks').find({ listId, description }).sort({ $natural: -1 }).toArray();
    tasks[0].id = tasks[0]._id;
    this.type = 'json';
    this.status = 200;
    this.body = tasks[0];
    db.close();
  });

  router.delete('/todo/task/:id', function* () {
    const { id } = this.params;
    const db = yield mongo.connect(url);
    yield db.collection('tasks').deleteOne({ _id: new mongo.ObjectID(id) });
    this.type = 'json';
    this.status = 200;
    this.body = { id, isDeleted: true };
    db.close();
  });
};
