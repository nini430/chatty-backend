import ip from 'ip';
import moment from 'moment';
import {Request, Response} from 'express';
import {config} from '@root/config';
import { StatusCodes } from 'http-status-codes';
import authService from '@services/db/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { JoiValidator } from '@globals/decorators/joi-validation.decorator';
import { emailSchema, passwordSchema } from '../schemes/password';
import crypto from 'crypto';
import { emailQueue } from '@services/queues/email.queue';
import { forgotPasswordTemplate } from '@services/emails/templates/forgot-password/forgot-password-template';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { resetPasswordTemplateInstance } from '@services/emails/templates/reset-password/reset-password-template';


export class Password {
  @JoiValidator(emailSchema)
  public async create(req: Request, res: Response) {
    const { email }=req.body;

    const existingUser = await authService.getUserByEmail(email);
    if(!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    };

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters = randomBytes.toString('hex');
    await authService.updatePasswordToken(existingUser.id, randomCharacters, Date.now() * 60 * 60 * 1000);

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;

    emailQueue.addEmailJob('forgotPasswordEmail',{
      receiverEmail: existingUser.email,
      subject: 'Reset Password',
      template: forgotPasswordTemplate.forgotPasswordTemplate(existingUser.username, resetLink),
    });

    return res.status(StatusCodes.OK).json({status:'ok', message: 'Password reset email sent'});
  }

  @JoiValidator(passwordSchema)
  public async update(req: Request, res: Response) {
    const { password, confirmPassword }=req.body;
    const {token}=req.params;
    if(password!==confirmPassword) {
      throw new BadRequestError('Passwords dont match');
    }
    const existingUser = await authService.getUserByPasswordToken(token);
    if(!existingUser) {
      throw new BadRequestError('Reset token expired');
    }

    existingUser.password = password;
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetTokenExpire = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: ip.address(),
      date: moment().format('DD/MM/YYYY HH:mm'),
    };

    const template = resetPasswordTemplateInstance.resetPasswordTemplate(templateParams);

    emailQueue.addEmailJob('forgotPasswordEmail', {
      receiverEmail: existingUser.email,
      subject: 'Reset Password confirmation',
      template,
    });

    return res.status(StatusCodes.OK).json({message:'Password reset successfull'});
  }
}
