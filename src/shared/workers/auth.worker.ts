import {DoneCallback, Job} from 'bull';
import Logger from 'bunyan';
import {config} from '@root/config';
import authService from '@services/db/auth.service';

const logger: Logger = config.createLogger('authWorker');

export class AuthWorker {
   async processAUthJob(job: Job, done: DoneCallback): Promise<void> {
      try{
        const {value}=job.data;
        await authService.createAuthUser(value);
        job.progress(100);
        done(null, job.data);
      }catch(err) {
        logger.error(err);
        done(err as Error);
      }
   }
}

export const authWorker : AuthWorker = new AuthWorker();
