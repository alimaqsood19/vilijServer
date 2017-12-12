const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChildrenSchema = require('./children');

const ParentSchema = new Schema({
  name: String,
  description: String,
  email: String,
  address: String,
  children: [ChildrenSchema],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  whoYouHelped: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  whoHelpedYou: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  offered: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ],
  received: [
    {
      type: Schema.Types.ObjectId,
      ref: 'parent'
    }
  ]
});

ParentSchema.virtual('wyh').get(function() {
  return this.whoYouHelped.length;
});

ParentSchema.virtual('why').get(function() {
  return this.whoHelpedYou.length;
});

const Parent = mongoose.model('parent', ParentSchema);

module.exports = Parent;
