import mongoose from 'mongoose';

const paymentSchema = new mongoose.schema ({
    _id: {
        type: mongoose.Schema.Types.UUID,
        required : true,
    },
    livraisonMode : {
        type: String,
        enum: ['Colissimo', 'Mondial Relay'],
        required: true,
    },
    paymentMode: {
        type: [String],
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
paymentSchema.index(
    {
        title: 'text',
        description: 'text'
    },
    {
      name: 'livraison_search_index',
      weights: {
        title: 10,
        description: 5
      },
    },
)

const Payment = mongoose.model('Livraison', paymentSchema);
export default Payment;