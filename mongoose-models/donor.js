const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const donorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  donationCount: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  lastDonationDone: {
    type: String,
    default: null,
  },
});

const Donor = mongoose.model("Donors", donorSchema);
module.exports = Donor;
