import { ObjectID } from 'mongodb';

export const init = (router) => {

  router.get('/todo/tasks', function* () {
    const tasks = yield this.mongo.db.collection('tasks').find().toArray();
    tasks.forEach(task => task.id = task._id);
    this.type = 'json';
    this.status = 200;
    this.body = tasks;
  });

  router.post('/todo/tasks', function* () {
    const { listId, description } = this.request.body.task;
    const { db } = this.mongo;
    yield db.collection('tasks').insertOne({ listId, description });
    const tasks = yield db.collection('tasks').find({ listId, description }).sort({ $natural: -1 }).toArray();
    tasks[0].id = tasks[0]._id;
    this.type = 'json';
    this.status = 200;
    this.body = tasks[0];
  });

  router.delete('/todo/task/:id', function* () {
    const { id } = this.params;
    yield this.mongo.db.collection('tasks').deleteOne({ _id: new ObjectID(id) });
    this.type = 'json';
    this.status = 200;
    this.body = { id, isDeleted: true };
  });
};
