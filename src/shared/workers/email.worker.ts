import { config } from '@root/config';
import { emailTransport } from '@services/emails/mail.transport';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';


const log : Logger = config.createLogger('emailWorker');


class EmailWorker {
  async addNotificationsEmail(job: Job, done: DoneCallback): Promise<void> {
    try{
      const {template, subject, receiverEmail}=job.data;
      await emailTransport.sendEmail(receiverEmail, subject, template);
      job.progress(100);
      done(null, job.data);
    }catch(err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const emailWorker:EmailWorker = new EmailWorker();
