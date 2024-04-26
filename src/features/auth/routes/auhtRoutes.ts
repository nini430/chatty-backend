import express, {Router} from 'express';
import { Signup } from '../controllers/signup';
import { Signin } from '../controllers/signin';
import { Signout } from '../controllers/signout';
import { Password } from '../controllers/password';


class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', Signin.prototype.read);
    this.router.post('/forgot-password', Password.prototype.create);
    this.router.post('/reset-password/:token', Password.prototype.update);

    return this.router;
  }

  public signoutRoute(): Router {
      this.router.post('/signout', Signout.prototype.signout);

      return this.router;
  }
}


export const authRoutes = new AuthRoutes();
