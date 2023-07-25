import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import * as path from "path";

import { EEmailActions } from "../enums/email.enum";
import {allTemplates} from "../constants/email.constants";

class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "No reply",
      service: "gmail",
      auth: {
        user: "sanyakolomijchuk07@gmail.com",
        pass: "nedhresitahtlmmp",
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "layouts"
        ),
        partialDir: path.join(
          process.cwd(),
          "src",
          "email-templates",
          "partials"
        ),
      },
      viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }
  public async sendMail(
    email: string,
    emailAction: EEmailActions,
    contex: Record<string, string | number> = {}
  ) {
    const { templateName, subject } = allTemplates[emailAction];
    const mailOptions = {
      to: email,
      subject,
      template: templateName,
      contex,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
