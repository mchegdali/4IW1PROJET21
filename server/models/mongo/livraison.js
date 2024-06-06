import mongoose from 'mongoose';

const livraisonSchema = new mongoose.schema ({
    _id: {
        type: mongoose.Schema.Types.UUID,
        required : true,
    },
    emailCustomer: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
        unique: true,
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // livraisonMode : {
    //     type: String,
    //     enum: ['Colissimo', 'Mondial Relay'],
    //     required: true,
    // },
    // paymentMode: {
    //     type: [String],
    //     required: true,
    // },
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
livraisonSchema.index(
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

const Livraison = mongoose.model('Livraison', livraisonSchema);
export default Livraison;