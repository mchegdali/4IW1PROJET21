// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.schema ({
//     id: {
//         type: mongoose.Schema.Types.UUID,
//         required : true,
//     },
//     numberCard: {
//         type: String,
//         required: true,
//     },
//     expiryAt: {
//         type: Date,
//         required: true,
//     },
//     cardCode: {
//         type: String,
//         required: true,
//     },
// },
// {
//     toObject: {
//       getters: true,
//     },
//     toJSON: {
//       getters: true,
//     },
//    },
// );
// paymentSchema.index(
//     {
//         title: 'text',
//         description: 'text'
//     },
//     {
//       name: 'payment_index',
//       weights: {
//         title: 10,
//         description: 5
//       },
//     },
// )

// const Payment = mongoose.model('Payment', paymentSchema);
// export default Payment;