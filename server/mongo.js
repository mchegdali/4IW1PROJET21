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
async function connectToMongo() {
  if (!process.env.MONGODB_CONNECTION_STRING) {
    throw new Error('MONGODB_CONNECTION_STRING is not set');
  }

  if (!process.env.MONGODB_USER) {
    throw new Error('MONGODB_USER is not set');
  }

  if (!process.env.MONGODB_PASSWORD) {
    throw new Error('MONGODB_PASSWORD is not set');
  }

  const connection = await mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
      dbName: 'fanthesie',
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    },
  );

  return connection;
}

export { connectToMongo };
