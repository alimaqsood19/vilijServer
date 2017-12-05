const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChildrenSchema = new Schema({
  name: String,
  age: String,
  gender: String,
  activities: String,
  allergies: String,
  medicalConditions: String,
  routines: String,
  additionalNotes: String
});

module.exports = ChildrenSchema;
