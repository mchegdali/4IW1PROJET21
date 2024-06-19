import mongoose from 'mongoose';

const deliveryChoiceSchema = new mongoose.Schema ({
    id: {
        type: mongoose.Schema.Types.UUID,
        required : true,
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
   },
);

deliveryChoiceSchema.index(
    {
        title: 'text',
        description: 'text'
    },
    {
      name: 'delivery_choice_index',
      weights: {
        title: 10,
        description: 5
      },
    },
)

const deliveryChoice = mongoose.model('deliveryChoice', deliveryChoiceSchema);
export default deliveryChoice;