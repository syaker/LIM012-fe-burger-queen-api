/* eslint-disable spaced-comment */
const { MongoClient } = require("mongodb");

const db = (dbUrl) => {
  // Nombre de bd
  const dbName = "BurguerQueenDB";
  //Creando un cliente
  const client = new MongoClient(dbUrl, { useUnifiedTopology: true });
  return new Promise((res) => {
    // Conectamos al servidor
    client.connect((error) => {
      if (error) {
        res(error);
      }
      const db = client.db(dbName);
      res(db); // retornamos la conexión con el nombre de la bd a usar
    });
  });
};

module.exports = { db };
