import Queue, {Job} from 'bull';
import {createBullBoard} from '@bull-board/api';
import {BullAdapter} from '@bull-board/api/bullAdapter';
import {ExpressAdapter} from '@bull-board/express';
import Logger from 'bunyan';
import {config} from '@root/config';
import { AuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface';

export let bullAdapters: BullAdapter[]=[];

export let serverAdapter: ExpressAdapter;

type BaseJobData = AuthJob | IUserJob | IEmailJob;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, {redis: {host:'localhost', port: 6379}});
    this.log = config.createLogger(`${queueName} Queue`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = Array.from(new Set(bullAdapters));
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });

    this.queue.on('completed', async(job: Job)=>{
      await job.remove();
    });

    this.queue.on('global:completed', (jobId: string)=>{
      this.log.info('job completed', {jobId});
    });

    this.queue.on('global:stalled', (jobId: string)=>{
      this.log.info('Job is stalled', {jobId});
    });
  }

  protected addJob(name: string, data: BaseJobData): void {
      this.queue.add(name, data, {attempts: 3, backoff: {delay: 5000, type: 'fixed'}});
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }


}
