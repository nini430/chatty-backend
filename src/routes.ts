import { authRoutes } from '@auth/routes/auhtRoutes';
import { currentRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { serverAdapter } from '@services/queues/base.queue';
import {Application} from 'express';

const Base_PATH = '/api/v1';

export default function(app: Application) {
    const routes=()=>{
      app.use('/queues', serverAdapter.getRouter());
      app.use(Base_PATH, authRoutes.routes());
      app.use(Base_PATH, authRoutes.signoutRoute());
      app.use(Base_PATH, authMiddleware.verifyUser, currentRoutes.routes());
    };

    routes();
}


