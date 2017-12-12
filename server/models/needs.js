const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChildrenSchema = require('./children');

const NeedSchema = new Schema({
  parents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  date: Date,
  time: String,
  specialNotes: String,
  selectedChildren: [ChildrenSchema]
});

const Needs = mongoose.model('need', NeedSchema);

module.exports = Needs;
