const { Schema, model } = require("mongoose");

const deliveryApiTokensSchema = new Schema({
  name: String,
  token: String,
  expiresIn: Number,
});

const DeliveryApiTokens = model("DeliveryApiTokens", deliveryApiTokensSchema);
module.exports = DeliveryApiTokens;
