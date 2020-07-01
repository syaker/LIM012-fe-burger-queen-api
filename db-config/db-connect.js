const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://ProjectBQ:laboratoriaBQ@clusterburguerqueen.nwsci.mongodb.net/BurguerQueenDB?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectToDB = () => {
  client.connect();
  console.log('Se conecto');
  // client.close();
};


module.exports = connectToDB;
