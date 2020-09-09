const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const db_operation = require('./operations');

const url = 'mongodb://localhost:27017';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log('Connected to MongoDB server!!');

  const db = client.db(dbname);

  db_operation.insertDocument(
    db,
    { name: 'Vadonut', description: 'Test' },
    'dishes',
    (result) => {
      console.log('Insert Document:\n', result.ops);

      db_operation.findDocuments(db, 'dishes', (docs) => {
        console.log('Found Documents:\n', docs);

        db_operation.updateDocument(
          db,
          { name: 'Vadonut' },
          { description: 'Updated Test' },
          'dishes',
          (result) => {
            console.log('Updated Document:\n', result.result);

            db_operation.findDocuments(db, 'dishes', (docs) => {
              console.log('Found Updated Documents:\n', docs);

              db.dropCollection('dishes', (result) => {
                console.log('Dropped Collection: ', result);

                client.close();
              });
            });
          }
        );
      });
    }
  );

  /* const collection = db.collection('dishes');

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
  ); */
});
