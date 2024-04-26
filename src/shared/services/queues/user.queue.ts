import { BaseQueue } from '@services/queues/base.queue';
import { IUserJob } from '@user/interfaces/user.interface';
import { userWorker } from '@workers/user.worker';



export class UserQueue extends BaseQueue {
    constructor() {
      super('user');
      this.processJob('saveUserToDb', 5, userWorker.processUserJob);
    }

    addSaveUserJob(name: string, data: IUserJob) {
        this.addJob(name, data);
    }


}


export const userQueue = new UserQueue();
