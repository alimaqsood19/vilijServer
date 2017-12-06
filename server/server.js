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

app.patch('/parents/friends/:id', (req, res) => {
  let id = req.params.id;

  Parent.findOneAndUpdate(
    { _id: id },
    { $set: { friends: req.body.friends } },
    { new: true }
  )
    .then(parent => {
      if (!parent) {
        return res.status(404).send('No parent with that ID found');
      }
      res.send(parent);
    })
    .catch(err => {
      res.status(400).send('Invalid ID');
    });
});

app.patch('/needs/:id', (req, res) => {
  let id = req.params.id;

  Needs.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    .then(need => {
      if (!need) {
        return res.status(404).send('No need with that ID found');
      }
      res.send(need);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.delete('/parents/remove/:id', (req, res) => {
  let id = req.params.id;

  Parent.findById({ _id: id }).then(parent => {
    if (!parent) {
      return res.status(404).send('No parent with that id to remove');
    }
  });

  Parent.remove({ _id: id })
    .then(() => {
      res.send(`Successfully deleted ${id}`);
    })
    .catch(err => {
      res.status(404).send(`Not found ${err}`);
    });
});

app.delete('/needs/remove/:id', (req, res) => {
  let id = req.params.id;

  Needs.findOne({ _id: id }).then(need => {
    if (!need) {
      return res.status(404).send('No need found with that ID');
    }
  });

  Needs.remove({ _id: id })
    .then(() => {
      res.send(`Successfully deleted ${id}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
