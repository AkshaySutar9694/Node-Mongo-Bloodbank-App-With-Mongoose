const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  requestType: {
    type: String,
    required: true,
  },
  requestId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Request = mongoose.model("Requests", requestSchema);
module.exports = Request;
