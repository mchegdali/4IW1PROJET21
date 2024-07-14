const {mongoose} = require ('mongoose');
const shippingSchema = new mongoose.Schema ({
    _id: {
        type: mongoose.Schema.Types.UUID,
        required : true,
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
    statusOrder: {
        type:String,
        required:false,
    },
    deliveryChoiceId: {
        type:  {
            _id: {
                type: mongoose.Schema.Types.UUID,
                required: true,
            },
            name: {
                type : String,
                required: true,
            },
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


const shipping = mongoose.model('shippings', shippingSchema);
module.exports =  shipping;