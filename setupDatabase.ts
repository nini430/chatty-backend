import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('database');


export default function() {
    const connect=async()=>{
        mongoose.connect(config.DATABASE_URL!)
        .then(()=>{
            log.info('Mongo connected successfully');
        })
        .catch((error)=>{
            log.error('Error connecting to the database', error);
            return process.exit(1);
        });
    };

    connect();

    mongoose.connection.on('disconnect', connect);
}

