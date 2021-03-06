'use strict';

/* eslint-disable camelcase*/

const express = require('express');
const ev = require('express-validation');
const router = express.Router();
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');
const boom = require('boom');
const jwt = require('jsonwebtoken');

const authorize=require('./modules/authorize');

// GET ROUTE
router.get('/foods', (req, res, next) => {
  knex('foods')
    .where('active', true)
    .orderBy('expiration','asc')
    .then((foods) => {
      res.send(foods);
    })
    .catch((err) => {
      next(err);
    });
});

// GET ROUTE W/ CATEGORY ID
router.get('/foods?catId=:catId', (req, res, next) => {
  const catId = req.params.catId;
  knex('foods')
    .where('active', true)
    .andWhere('category', catId)
    .then((items) => {
      res.send(items);
    })
    .catch((err)=>{
      next(err);
    });
});

// GET ROUTE W/ USER ID
router.get('/foods/:userId/', (req, res, next) => {
  knex('foods')
    .where('active', true)
    .andWhere('user_id', req.params.userId)
    .then((items) => {
      res.send(items);
    })
    .catch((err)=>{
      next(err);
    });
});

// POST ROUTE
router.post('/foods', (req, res, next) => {
  let insertion={
    'user_id': req.body.userId,
    'image_url': req.body.imageUrl,
    'category': req.body.category,
    'comments': req.body.comments,
    'expiration': req.body.expiration
  };
  knex('foods')
    .insert(insertion, '*')
    .then((foods) => {
      res.send(foods[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE ROUTE
router.delete('/foods/:id', (req, res, next) => {
  knex('foods')
    .where('id', req.params.id)
    .first()
    .update('active', false)
    .then((item) => {
      res.send(item.active);
    })
    .catch((err)=>{
      next(err);
    });
});


module.exports = router;
