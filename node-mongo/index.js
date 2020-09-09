const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log('Connected to MongoDB server!!');

  const db = client.db(dbname);
  const collection = db.collection('dishes');

  collection.insertOne(
    { name: 'Hot Pizza', description: 'Very hot' },
    (err, result) => {
      assert.equal(err, null);
      console.log('Insert: ');
      console.log(result.ops);

      collection.find().toArray((err, docs) => {
        assert.equal(err, null);

        console.log('Found documents: ');
        console.log(docs);

        db.dropCollection('dishes', (err, result) => {
          assert.equal(err, null);
          client.close();
        });
      });
    }
  );
});
