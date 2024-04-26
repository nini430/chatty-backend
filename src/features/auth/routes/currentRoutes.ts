import { Router } from 'express';
import { CurrentUser } from '../controllers/current-user';
import { authMiddleware } from '@globals/helpers/auth-middleware';


class CurrentRoutes {
  private currentRouter: Router;

  constructor() {
    this.currentRouter = Router();
  }


  routes(): Router {
    this.currentRouter.get('/current-user', authMiddleware.checkAuthentication, CurrentUser.prototype.read);

    return this.currentRouter;
  }
}


export const currentRoutes: CurrentRoutes = new CurrentRoutes();
