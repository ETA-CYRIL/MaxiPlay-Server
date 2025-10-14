import { generateTemplate } from "#/mail/template";
import { generateToken } from "./helper";
import { RequestHandler } from "express";

import { CreateUser } from "#/@types/user";
import path from "path";
import { CreateUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import nodemailer from "nodemailer";
import {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import EmailVerificationToken from "#/models/emailVerificationToken";

//
import { MailtrapClient } from "mailtrap";
//

const generateMailTransporter = () => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  //token  = 6 digit otp => 123456 => send

  const { name, email, userId } = profile;

  // const token = generateToken(6);

  const welcomeMessage = `Hi ${name}, welcome too`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome Message",
    html: generateTemplate({
      title: "Welcome to MaxiLay",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo1.png",
        path: path.join(__dirname, "../mail/images/logo1.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/images/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { link, email } = options;

  const message = ` use this link to reset password`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Passwprd Link",
    html: generateTemplate({
      title: "Forget Password",
      message,
      logo: "cid:logo", //content ID
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Passwprd",
    }),
    attachments: [
      {
        filename: "logo1.png",
        path: path.join(__dirname, "../mail/images/logo1.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/images/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendPassResetSeccuessEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  const message = `Dear ${name}, Password updated Sucessfully, sign in with your new password`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Passwprd Reset Successfully",
    html: generateTemplate({
      title: "Your New Password",
      message,
      logo: "cid:logo", //content ID
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo1.png",
        path: path.join(__dirname, "../mail/images/logo1.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/images/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

// __________________________ new mailling setting

const TOKEN = "542ab2c2dae9551cca83129623fad0d4";
const ENDPOINT = "send.api.mailtrap.io";

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@www.ileit-seeds.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "eta4272@gmail.com",
  },
];

client
  // .send({
  //   from: sender,
  //   to: recipients,
  //   subject: "You are awesome!",
  //   text: "Congrats for sending test email with Mailtrap!",
  //   category: "Integration Test",
  // })
  // .then(console.log, console.error);
