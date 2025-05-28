import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { MailData } from './interfaces/mail-data.interface';
import SendGrid from '@sendgrid/mail';
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
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

  private compileTemplate(
    templatePath: string,
    variables: Record<string, any>,
  ): string {
    const html = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(html, { strict: true });
    return template(variables);
  }

  private getTemplatePath(templateName: string): string {
    return path.join(
      this.configService.getOrThrow('app.workingDirectory', { infer: true }),
      'src',
      'mail',
      'mail-templates',
      `${templateName}.hbs`,
    );
  }

  async sendCredentials(
    mailData: MailData<{ name: string; password: string }>,
  ) {
    const appName = this.configService.get('app.name', { infer: true });
    const templateVariables = {
      title: `Welcome to ${appName}`,
      appName,
      name: mailData.data.name,
      password: mailData.data.password,
      email: mailData.to,
      year: new Date().getFullYear(),
    };

    const html = this.compileTemplate(
      this.getTemplatePath('activation'),
      templateVariables,
    );

    return await this.send({
      to: mailData.to,
      from: 'hr@aleh.tech',
      subject: `Welcome to ${appName}`,
      html,
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ) {
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    const tokenExpires = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });

    const tokenExpiresIn = tokenExpires.replace('m', ' minutes');

    const templateVariables = {
      title: 'Reset Your Password',
      resetLink: url.toString(),
      appName: this.configService.get('app.name', { infer: true }),
      tokenExpires: tokenExpiresIn,
      year: new Date().getFullYear(),
    };

    const html = await this.compileTemplate(
      this.getTemplatePath('reset-password'),
      templateVariables,
    );

    console.log(html);
    return await this.send({
      to: mailData.to,
      from: 'hr@aleh.tech',
      subject: 'Reset Your Password',
      html,
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
