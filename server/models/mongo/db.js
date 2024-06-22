import mongoose from 'mongoose';

// mongoose.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     console.log(doc);
//     console.log(ret);
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   },
// });

await mongoose.connect(process.env.MONGODB_URL, {
  dbName: process.env.MONGODB_DBNAME,
});

export default mongoose;
