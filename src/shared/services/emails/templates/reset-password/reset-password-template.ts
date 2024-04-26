import { config } from '@root/config';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import Logger from 'bunyan';
import ejs from 'ejs';
import fs from 'fs';

const logger: Logger = config.createLogger('Reset password');


class ResetPasswordTemplate {
   public resetPasswordTemplate(passwordParams: IResetPasswordParams) {
    const {username, date, email, ipaddress}= passwordParams;
    try{
      const template= ejs.render(fs.readFileSync(__dirname+'/reset-password-template.ejs', 'utf8'), {
        username,
        email,
        ipaddress,
        date,
        image_url:'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png'
      });
      return template;
    }catch(err) {
      logger.info('Error setting up a template', err);
    }


   }
}

export const resetPasswordTemplateInstance = new ResetPasswordTemplate();
