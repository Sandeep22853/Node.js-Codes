const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017'; 
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    const db = client.db('testDB');         
    const users = db.collection('users');   

    const result = await users.insertOne({ name: 'Sandeep', age: 20 });
    console.log('User inserted with _id:', result.insertedId);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();