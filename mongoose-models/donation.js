const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const donationSchema = new Schema({
  donorId: {
    type: Schema.Types.ObjectId,
    ref: "Donors",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  campId: {
    type: Schema.Types.ObjectId,
    ref: "Campaigns",
    required: true,
  },
});

const Donation = mongoose.model("Donations", donationSchema);
module.exports = Donation;
