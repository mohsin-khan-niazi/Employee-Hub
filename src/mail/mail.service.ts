import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { MailData } from './interfaces/mail-data.interface';
import SendGrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    SendGrid.setApiKey(
      this.configService.getOrThrow('mail.sendGridApiKey', { infer: true }),
    );
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);
    return transport;
  }

  async sendCredentials(
    mailData: MailData<{ name: string; password: string }>,
  ) {
    return await this.send({
      to: mailData.to,
      from: 'hr@aleh.tech',
      templateId: 'd-0c493dc94b9e4c7b8f874cb0424bcc9f',
      dynamicTemplateData: {
        password: mailData.data.password,
        name: mailData.data.name,
        email: mailData.to,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ) {
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    return await this.send({
      to: mailData.to,
      from: 'hr@aleh.tech',
      templateId: 'd-9a3d496f8c384078be0753217384776c',
      dynamicTemplateData: {
        url,
      },
    });
  }

  // async sendLeaveRequest(to, name, type, from, toDate, status) {
  //   const date1 = new Date(from);
  //   const formattedfrom = date1.toLocaleDateString('en-US', {
  //     day: '2-digit',
  //     month: 'short',
  //   });
  //   const date2 = new Date(toDate);
  //   const formattedto = date2.toLocaleDateString('en-US', {
  //     day: '2-digit',
  //     month: 'short',
  //   });
  //   return await this.send({
  //     to,
  //     from: 'hr@aleh.tech',
  //     templateId: 'd-7134eaed59a94290b0675d76259e8557',
  //     subject: `${type} request ${status}!`,
  //     dynamicTemplateData: {
  //       name,
  //       type,
  //       from: formattedfrom,
  //       to: formattedto,
  //       status,
  //     },
  //   });
  // }

  // async sendSalaryLink(month, link, name, to) {
  //   const url = `https://attendance-api.aleh.tech/generateSlip/${link}`;
  //   return await this.send({
  //     to,
  //     from: 'hr@aleh.tech',
  //     subject: `${month}'s Salary slip is here!`,
  //     templateId: 'd-d6a2c46d474846879468eca92e906a4c',
  //     dynamicTemplateData: {
  //       url,
  //       name,
  //       month,
  //     },
  //   });
  // }
}
