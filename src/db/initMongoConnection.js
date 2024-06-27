import mongoose from 'mongoose';
import checkEnv  from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = checkEnv('MONGODB_USER');
    const pwd = checkEnv('MONGODB_PASSWORD');
    const url = checkEnv('MONGODB_URL');
    const db = checkEnv('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    
  }
};
