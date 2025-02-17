const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bloodStockSchema = new Schema({
  bloodGroup: {
    type: String,
    required: true,
    unique: true,
  },
  unitsAvailable: {
    type: Number,
    required: true,
  },
});

const BloodStock = mongoose.model("Bloodstocks", bloodStockSchema);
module.exports = BloodStock;
