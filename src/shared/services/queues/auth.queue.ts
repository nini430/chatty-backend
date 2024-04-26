import { AuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from '@services/queues/base.queue';
import { authWorker } from '@workers/auth.worker';

export class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserToDb',5, authWorker.processAUthJob);
  }

  public addAuthUserJob(name: string, data: AuthJob):void {
    this.addJob(name, data);
  }
}

export const authQueue = new AuthQueue();
