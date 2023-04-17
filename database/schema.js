const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  full_name: String,
  email: String,
  ph_no: Number,
  linked_in: String,
  work_exp: String,
  pdf: {
    data: Buffer,
    contentType: String
  }
})

const Applicant = mongoose.model('Applicant', schema);

module.exports = {
  schema: schema,
  Applicant: Applicant
}