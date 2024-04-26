import {DoneCallback, Job} from 'bull';
import { config } from '@root/config';
import Logger from 'bunyan';
import { userService } from '@services/db/user.service';


const logger : Logger = config.createLogger('user');


export class UserWorker {
  async processUserJob(job: Job, done: DoneCallback) {
    try{
      const {value}=job.data;
      await userService.createUser(value);
      job.progress(100);
    }catch(err) {
      logger.error(err);
      done(err as Error);

    }
  }
}

export const userWorker = new UserWorker();


