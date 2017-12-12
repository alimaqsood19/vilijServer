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

//Simple get request to make sure server is up and running
app.get('/', (req, res) => {
  res.send('Hello World');
});

//Gets all the parents in DB, populates friends list and shows name, desc, email and address
app.get('/parents', (req, res) => {
  Parent.find({})
    .populate('friends', 'name description email address ')
    .then(parents => {
      res.send(parents);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Grabs a particular parent based on the ID
app.get('/parents/:id', (req, res) => {
  let id = req.params.id;
  Parent.find({ _id: id })
    .populate('friends', 'name description email address')
    .populate('offered', 'date time specialNotes')
    .populate('received', 'date time specialNotes')
    .then(parent => {
      res.send(parent);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Update a particular parent based on ID
app.patch('/parents/:id', (req, res) => {
  let id = req.params.id;
  Parent.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    .then(parent => {
      res.status(200).send(parent);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Creating a new parent, in the request thats being sent to endpoint should match Parent Schema
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

//Grabs all the needs and populates the parents information
app.get('/needs', (req, res) => {
  Needs.find({})
    .populate('parents')
    .then(needs => {
      res.send(needs);
    });
});

//Grab a need based on a given ID
app.get('/needs/:id', (req, res) => {
  Needs.find({ _id: req.params.id });
});

//Creates a new need
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

//Updates need based on a ID
app.patch('/needs/:id', (req, res) => {
  let id = req.params.id;

  Needs.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    .then(need => {
      if (!need) {
        return res.status(404).send('No need with that ID found');
      }
      res.status(200).send(need);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Update offered array value (add a new one)
app.patch('/parents/offered/:id', (req, res) => {
  let id = req.params.id;
  Parent.findOneAndUpdate({ _id: id }, { $push: { offered: req.body.offered } })
    .then(parent => {
      res.status(200).send('succesfull');
    })
    .catch(err => {
      res.status(400).send(err);
    });
});
//Remove offered ID from array, need to pass the ID to remove in req.body._id
app.patch('/parents/offered/remove/:id', (req, res) => {
  let id = req.params.id;
  Parent.findOneAndUpdate({ _id: id }, { $pull: { offered: req.body._id } })
    .then(parent => {
      res.status(200).send('successfully removed');
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Update received array value (add a new one)
app.patch('/parents/received/:id', (req, res) => {
  let id = req.params.id;
  Parent.findOneAndUpdate(
    { _id: id },
    { $push: { received: req.body.received } }
  )
    .then(parent => {
      res.status(200).send(`successfully added ${req.body.received}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Remove an ID from the received array
app.patch('/parents/received/remove/:id', (req, res) => {
  let id = req.params.id;
  Parent.findOneAndUpdate({ _id: id }, { $pull: { received: req.body._id } })
    .then(parent => {
      res.status(200).send(`successfully removed ${req.body._id}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Update parents WHY values (add a new one)
app.patch('/parents/WHY/:id', (req, res) => {
  Parent.findOneAndUpdate(
    { _id: id },
    { $push: { whoHelpedYou: req.body.whoHelpedYou } }
  )
    .then(parent => {
      res.status(200).send(`successfully added ${req.body.whoHelpedYou}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});
//Remove parents WHY id's
app.patch('/parents/remove/WHY/:id', (req, res) => {
  Parent.findOneAndUpdate(
    { _id: id },
    { $pull: { whoHelpedYou: req.body.whoHelpedYou } }
  )
    .then(parent => {
      res.status(200).send(`successfully removed ${req.body.whoHelpedYou}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Updates WYH values (add a new one)
app.patch('/parents/WYH/:id', (req, res) => {
  Parent.findOneAndUpdate(
    { _id: id },
    { $push: { whoYouHelped: req.body.whoYouHelped } }
  )
    .then(parent => {
      res.status(200).send(`successfully added ${req.body.whoYouHelped}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Remove a WYH id from list
app.patch('/parents/remove/WYH/:id', (req, res) => {
  Parent.findOneAndUpdate(
    { _id: id },
    { $pull: { whoYouHelped: req.body.whoYouHelped } }
  )
    .then(parent => {
      res.status(200).send(`successfully removed ${req.body.whoYouHelped}`);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Update friends field for parent documents to push a new doc to list of friends
app.patch('/parents/friends/:id', (req, res) => {
  let id = req.params.id;

  Parent.find({ _id: req.body.friends }).then(friend => {
    if (!friend) {
      return res.status(404).send('No parent with that ID found');
    }
  });

  Parent.findOneAndUpdate(
    { _id: id },
    { $push: { friends: req.body.friends } },
    { new: true }
  )
    .then(parent => {
      res.status(200).send(parent);
    })
    .catch(err => {
      res.status(400).send('Invalid ID');
    });
});

//Remove from friends list with a particular ID
app.patch('/parents/friends/remove/:id', (req, res) => {
  let id = req.params.id;

  Parent.findOneAndUpdate({ _id: id }, { $pull: { friends: req.body.friends } })
    .then(() => {
      res.status(200).send(`successfully removed ${req.body.friends}`);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

//Removes parent from DB
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

//Removes need from DB
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
