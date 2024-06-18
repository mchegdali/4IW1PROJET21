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

/**
 * Connects to MongoDB using the provided environment variables.
 *
 * @return {Promise<mongoose>} A promise that resolves to the MongoDB connection.
 * @throws {Error} If any of the required environment variables are not set.
 */
async function connectToMongo(url, dbName) {
  const connection = await mongoose.connect(url, {
    dbName,
  });

  return connection;
}

export { connectToMongo };
