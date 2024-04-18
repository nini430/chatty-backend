import express,{Express} from 'express';
import { ServerSetup } from '../setupServer';
import connectDb from '../setupDatabase';
import {config} from '../config';

class Application {
    public initialize() {
        this.loadConfig();
        connectDb();
        const app: Express = express();
        const chattyServer: ServerSetup = new ServerSetup(app);
        chattyServer.start();
    }

    private loadConfig() {
        config.validateConfig();
    }

}


const application = new Application();
application.initialize();