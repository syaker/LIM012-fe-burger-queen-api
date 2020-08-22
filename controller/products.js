const {
  findById,
  insertDoc,
  deleteById,
  findAll,
} = require("../utils/functions_crud");
const { db } = require("../db-connection/connection");
const { dbUrl } = require("../config");

const ObjectID = require("mongodb").ObjectID;

const mongodb = db(dbUrl);

module.exports = {
  getProducts: (req, resp, next) => {
    const page = req.query.page || 1;
    const limitNumber = req.query.limit || 10;
    const skip_page = (page - 1) * limitNumber;
    findAll("products", skip_page, limitNumber, next)
      .then((docs) => {
        resp.status(200).json(docs);
      })
      .catch(() => {
        return next(500);
      });
  },
  getAnProduct: (req, resp, next) => {
    const uidProduct = req.params.productId; // id del producto
    findById("products", uidProduct, next)
      .then((product) => {
        if (!product) {
          return next(404);
        }
        resp.status(200).json(product);
      })
      .catch((err) => {
        return next(404);
      });
  },
  createAnProduct: (req, resp, next) => {
    const { name, price, imagen, type } = req.body;
    let isUndefined;
    imagen === undefined ? (isUndefined = true) : (isUndefined = false);
    if (!name || !price) {
      return next(400);
    }
    if (!name && !price) {
      return next(400);
    }
    const product = {
      name: String(name),
      price: Number(price),
      imagen: isUndefined ? String(imagen) : new URL(imagen),
      type: String(type),
      dateEntry: new Date(),
    };
    insertDoc("products", product, next)
      .then((productData) => {
        const name = productData.ops[0].name;
        const _id = productData.ops[0]._id;
        const price = productData.ops[0].price;
        const image = productData.ops[0].imagen;
        const type = productData.ops[0].type;
        const dateEntry = productData.ops[0].dateEntry;
        const objProduct = {
          _id,
          name,
          price,
          image,
          type,
          dateEntry,
        };
        return objProduct;
      })
      .then((product) => resp.status(200).json(product));
  },
  updateAnProduct: (req, resp, next) => {
    const { name, price } = req.body;
    const uidProduct = req.params.productId;
    const updatedProduct = req.body;
    if (price) if (isNaN(price) === true) return next(400);
    if (name) if (typeof name !== "string") return next(400);
    mongodb
      .then((db) => {
        db.collection("products")
          .findOne({ _id: ObjectID(uidProduct) })
          .then((product) => {
            if (!product) return next(404);
            db.collection("products").updateOne(
              { _id: ObjectID(uidProduct) },
              { $set: updatedProduct }
            );
            db.collection("products")
              .findOne({ _id: ObjectID(uidProduct) })
              .then((product) => resp.status(200).json(product));
          });
      })
      .catch((err) => {
        return next(404);
      });
  },
  deleteAnProduct: (req, resp, next) => {
    const uidProduct = req.params.productId;
    findById("products", uidProduct, next)
      .then((productData) => {
        if (!productData) return next(404);
        deleteById("products", uidProduct, next);
        findById("products", uidProduct, next).then((product) => {
          if (!product) {
            resp.status(200).json(productData);
          }
        });
      })
      .catch((err) => {
        return next(404);
      });
  },
};
