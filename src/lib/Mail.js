import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';
import nodemailerhbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import { resolve } from 'path';
class Mail {
  constructor() {
    const { host, secure, port, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configureTemplates();
  }
  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
  sendMail(massage) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...massage,
    });
  }
}
export default new Mail();
