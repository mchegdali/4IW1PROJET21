const mongoose = require('mongoose');
const connection = require('./db');

const deliveryChoiceSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    toObject: {
      getters: true,
    },
    toJSON: {
      getters: true,
    },
    timestamps: true,
  },
);


const deliveryChoiceMongo =  connection.model('deliveryChoices', deliveryChoiceSchema);

module.exports = deliveryChoiceMongo;
