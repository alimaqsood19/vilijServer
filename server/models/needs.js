const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NeedSchema = new Schema({
  parents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  date: Date,
  time: String,
  specialNotes: String
});

const Needs = mongoose.model('need', NeedSchema);

module.exports = Needs;
