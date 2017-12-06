const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const Parent = require('./models/parents');
const Needs = require('./models/needs');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/parents', (req, res) => {
  Parent.find({})
    .populate('friends')
    .then(parents => {
      res.send(parents);
    });
});

app.post('/parents', (req, res) => {
  let parent = new Parent(req.body);

  parent
    .save()
    .then(parent => {
      res.send(parent);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/needs', (req, res) => {
  Needs.find({})
    .populate('parents')
    .then(needs => {
      res.send(needs);
    });
});

app.post('/needs', (req, res) => {
  let need = new Needs(req.body);

  need
    .save()
    .then(need => {
      res.send(need);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

const someDate = new Date();
console.log('date', someDate);
const someMoment = moment().format('MMM Do YYYY');
console.log('moment', someMoment);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
