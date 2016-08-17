import mongo from 'mongodb';

const url = 'mongodb://localhost:27017/todo';

export const init = (router) => {

  router.get('/todo/lists', function* () {
    const db = yield mongo.connect(url);
    const lists = yield db.collection('lists').find().toArray();
    lists.forEach(list => list.id = list._id);
    this.type = 'json';
    this.status = 200;
    this.body = lists;
    db.close();
  });

  router.post('/todo/lists', function* () {
    const { label } = this.request.body.todo;
    const db = yield mongo.connect(url);
    yield db.collection('lists').insertOne({ label });
    const lists = yield db.collection('lists').find({ label }).sort({ $natural: -1 }).toArray();
    lists[0].id = lists[0]._id;
    this.type = 'json';
    this.status = 200;
    this.body = lists[0];
    db.close();
  });

  router.delete('/todo/list/:id', function* () {
    const { id } = this.params;
    const db = yield mongo.connect(url);
    yield db.collection('lists').deleteOne({ _id: new mongo.ObjectID(id) });
    this.type = 'json';
    this.status = 200;
    this.body = { id, isDeleted: true };
    db.close();
  });
};
