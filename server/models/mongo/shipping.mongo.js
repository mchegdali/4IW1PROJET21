const {mongoose} = require ('mongoose');
const shippingSchema = new mongoose.Schema ({
    id: {
        type: mongoose.Schema.Types.UUID,
        required : true,
    },
    emailCustomer: {
        type: String,
        required: true,

    },
    fullname: {
        type:  String,
        required: true,
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
    deliveryChoiceShipping: {
        type:  {
            id: {
                type: mongoose.Schema.Types.UUID,
                required: true,
            },
            name: {
                type : String,
                required: true,
            },
        default: null,
        }
    }
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


const shipping = mongoose.model('shipping', shippingSchema);
export default shipping;