import mongoose from 'mongoose';

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

  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: 'fanthesie',
    auth: {
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
    },
  });
}

export { connectToMongo };
