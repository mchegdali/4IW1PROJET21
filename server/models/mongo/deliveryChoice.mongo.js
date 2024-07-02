import mongoose from 'mongoose';

const deliveryChoiceSchema = new mongoose.Schema(
  {
    id: {
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

deliveryChoiceSchema.index(
  { name: 'text', description: 'text', 'deliveryCoice.name': 'text' },
);

const deliveryChoiceMongo = mongoose.model('DeliveryChoice', deliveryChoiceSchema);

export default deliveryChoiceMongo;
