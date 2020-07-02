const { MongoClient } = require('mongodb');

const connectToDB = async (uri) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await client.connect();
  return result.db('BurguerQueenDB');
};

module.exports = connectToDB;
