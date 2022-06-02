const express = require("express");
const res = require("express/lib/response");
const Partner = require("../models/partner");
const partnersRouter = express.Router();
const authenticate = require("../authenticate");
const { verify } = require("jsonwebtoken");
const cors = require("./cors");

partnersRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Partner.find().then((partners) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(partners);
    });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.create(req.body).then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      });
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(`PUT operations not supported on /partners`);
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

partnersRouter
  .route(`/:partnerId`)
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.end(
        `POST operation not supported on /partners/${req.params.partnerId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndUpdate(
        req.params.partnerId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then((partner) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        })
        .catch((err) => next(err));
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = partnersRouter;
