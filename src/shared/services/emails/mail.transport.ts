import SendgridMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { config } from '@root/config';
import Logger from 'bunyan';
import { BadRequestError } from '@globals/helpers/error-handler';

const log: Logger = config.createLogger('mailOptions');

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}


SendgridMail.setApiKey(config.SENDGRID_API_KEY!);


class EmailTransport {

  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
      if(config.NODE_ENV==='test' || config.NODE_ENV==='development') {
        await this.developmentEmailSender(receiverEmail, subject, body);
      }else{
        await this.productionEmailSender(receiverEmail, subject, body);
      }
  }
  private async developmentEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {

    const transport: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const mailOptions: MailOptions = {
      from: `Chatty app <${config.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject,
      html: body
    };

    try{
      await transport.sendMail(mailOptions);
      log.info('Development email sent successfully');
    }catch(err) {
      log.error('Error sending email');
      throw new BadRequestError('Error sending Email');
    }
  }

  private async productionEmailSender(receiverEmail: string, subject: string, body: string) {
      const emailOptions: MailOptions = {
        from: `Chatty app <${config.SENDER_EMAIL}>`,
        to: receiverEmail,
        subject,
        html: body
      };

      try{
       await SendgridMail.send(emailOptions);
       log.info('Production email sent successfully');
      }catch(err) {
        log.error('Error sending Email');
        throw new BadRequestError('Error sending email');
      }
  }
}

export const emailTransport = new EmailTransport();
