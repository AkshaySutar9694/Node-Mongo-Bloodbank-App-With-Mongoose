const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  participants: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Donors",
    required: true,
  },
});

campaignSchema.statics.geCampDetails = async function (filter) {
  return this.find(filter);
};

const Campaign = mongoose.model("Campaigns", campaignSchema);
module.exports = Campaign;
