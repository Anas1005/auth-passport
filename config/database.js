import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
);

let isDBConnected = false;

const dbConnect = async () => {
    if (isDBConnected) {
        console.log('DB is already connected...');
        return Promise.resolve();
    }

    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB Connection Done...');
        console.log(process.env.DB_PASSWORD);
        isDBConnected = true;
        return Promise.resolve();
    } catch (error) {
        console.error('Error in DB connection:', error);
        return Promise.reject(error);
    }
};

export default dbConnect;
