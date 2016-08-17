import { ObjectID } from 'mongodb';

export const init = (router) => {

  router.get('/todo/lists', function* () {
    const lists = yield this.mongo.db.collection('lists').find().toArray();
    lists.forEach(list => list.id = list._id);
    this.body = lists;
  });

  router.post('/todo/lists', function* () {
    const { label } = this.request.body.todo;
    const { db } = this.mongo;
    yield db.collection('lists').insertOne({ label });
    const lists = yield db.collection('lists').find({ label }).sort({ $natural: -1 }).toArray();
    lists[0].id = lists[0]._id;
    this.body = lists[0];
  });

  router.delete('/todo/list/:id', function* () {
    const { id } = this.params;
    yield this.mongo.db.collection('lists').deleteOne({ _id: new ObjectID(id) });
    this.body = { id, isDeleted: true };
  });
};
