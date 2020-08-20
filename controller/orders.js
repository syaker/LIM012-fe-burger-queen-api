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
  getOrders: (req, resp, next) => {
    const page = req.query.page || 1;
    const limitNumber = req.query.limit || 10;
    const skip_page = (page - 1) * limitNumber;
    findAll("orders", skip_page, limitNumber, next)
      .then((docs) => {
        resp.status(200).json(docs);
      })
      .catch(() => {
        return next(500);
      });
  },
  getAnOrder: (req, resp, next) => {
    const orderId = req.params.orderId; // id de la orden
    if (ObjectID.isValid(orderId)) {
      mongodb.then((db) => {
        db.collection("orders")
          .findOne({ _id: ObjectID(orderId) })
          .then((order) => {
            if (!order) return next(404);
            resp.status(200).json(order);
          });
      });
    }
  },
  createAnOrder: async (req, resp, next) => {
    const { userId, products } = req.body;
    let productsArr = [];
    if (!userId || !products) {
      return next(400);
    }
    for (let i = 0; i < products.length; i++) {
      const productID = products[i].productId;
      const productQty = products[i].qty;
      const product = await findById("products", productID, next).then(
        (product) => {
          return product;
        }
      );
      productsArr.push({ product, qty: productQty });
    }
    const order = {
      userId: req.user._id,
      client: req.user.roles.admin ? null : "client",
      products: productsArr,
      status: "pending",
      dateEntry: new Date(),
      dateProcessed: "",
    };
    if (order.userId === null) return next(400);
    insertDoc("orders", order, next).then((order) => {
      resp.status(200).json(order.ops[0]);
    });
  },
  updateAnOrder: (req, resp, next) => {
    const order = req.body;
    const orderId = req.params.orderId;
    const status = ["pending", "delivering", "delivered", "preparing"];
    if (order.status === "canceled") return next(404);
    if (!Object.keys(order)) return next(400);
    if (!status.includes(order.status)) return next(400);
    mongodb.then((db) => {
      db.collection("orders")
        .findOne({ _id: ObjectID(orderId) })
        .then((orderData) => {
          if (!orderData) return next(404);
          db.collection("orders")
            .updateOne({ _id: ObjectID(orderId) }, { $set: order })
            .then(() => {
              db.collection("orders")
                .findOne({ _id: ObjectID(orderId) })
                .then((order) => {
                  resp.status(200).json(order);
                });
            });
        })
        .catch((err) => {
          return next(404);
        });
    });
  },
  deleteAnOrder: (req, resp, next) => {
    const orderId = req.params.orderId;
    findById("orders", orderId, next)
      .then((order) => {
        if (!order || order.status === "canceled") return next(404);
        deleteById("orders", orderId, next);
        findById("orders", orderId, next).then((orderData) => {
          if (!orderData) {
            resp.status(200).json(order);
          }
        });
      })
      .catch((err) => {
        return next(404);
      });
  },
};
