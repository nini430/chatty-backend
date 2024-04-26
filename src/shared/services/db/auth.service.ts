import { AuthDocument } from '@auth/interfaces/auth.interface';
import Auth from '@auth/models/auth.schema';
import { Helpers } from '@globals/helpers/helpers';

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

  public async getUserByEmail(email: string) {
    const user = await Auth.findOne({email: Helpers.toLowerCase(email)});
    return user;
 }

 public async updatePasswordToken(authId: string, token: string, tokenExpiration: number) {
    await Auth.updateOne({_id: authId}, {
      passwordResetToken: token,
      passwordResetTokenExpire: tokenExpiration
    });
 }

 public getUserByPasswordToken(token: string): Promise<AuthDocument| null> {
  return Auth.findOne({passwordResetToken: token, passwordResetTokenExpire: {$gt: Date.now()}});
 }
}



const authService = new AuthService();

export default authService;

