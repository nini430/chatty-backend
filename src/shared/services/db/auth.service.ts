import { AuthDocument } from '@/auth/interfaces/auth.interface';
import Auth from '@/auth/models/auth.schema';
import { Helpers } from '@/globals/helpers/helpers';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<AuthDocument | null> {
      const query={
        $or: [{username: Helpers.firstLetterUppercase(username) }, {email: Helpers.toLowerCase(email)}]
      };

      const user = (await Auth.findOne(query)) as any;
      return user;
  }

  public async createAuthUser(data: AuthDocument) {
    await Auth.create(data);
  }

  public async getUserByUsername(username: string) {
    const user = await Auth.findOne({username: Helpers.firstLetterUppercase(username)});
    return user;
  }
}



const authService = new AuthService();

export default authService;

