import mongoose from 'mongoose';
import Logger from 'bunyan';

import { config } from '@root/config';
import { redisConnection } from '@services/redis/redis.connection';

const log: Logger = config.createLogger('database');


export default function() {
    const connect=async()=>{
        mongoose.connect(config.DATABASE_URL!)
        .then(()=>{
            log.info('Mongo connected successfully');
            redisConnection.connect();
        })
        .catch((error)=>{
            log.error('Error connecting to the database', error);
            return process.exit(1);
        });
    };

    connect();

    mongoose.connection.on('disconnect', connect);
}

