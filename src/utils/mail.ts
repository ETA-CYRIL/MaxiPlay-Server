import { generateTemplate } from "#/mail/template";
import { generateToken } from "./helper";
import { RequestHandler } from "express";

import { CreateUser } from "#/@types/user";
import path from "path";
import { CreateUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import nodemailer from "nodemailer";
import {
  AUTH_EMAIL,
  MAILTRAP_PASS,
  MAILTRAP_TOKEN,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import fs from "fs";

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
  const { name, email } = profile;

  // __________________________ new mailling setting

  const welcomeMessage = `Hi ${name}, welcome`;

  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: VERIFICATION_EMAIL,
    name: "Verification MaxiPlay",
  };
  const recipients = [
    {
      email,
    },
  ];

  // sending mail using "custom domain"
  // const welcomeImage = fs.readFileSync(
  //   path.join(__dirname, "../mail/images/welcome.png")
  // );
  // const logoImage = fs.readFileSync(
  //   path.join(__dirname, "../mail/images/logo1.png")
  // );

  // client.send({
  //   from: sender,
  //   to: recipients,
  //   subject: "Verification Email",
  //   html: generateTemplate({
  //     title: "Welcome to Maxipay",
  //     message: welcomeMessage,
  //     logo: "cid:logo",
  //     banner: "cid:welcome",
  //     link: "#",
  //     btnTitle: token,
  //   }),
  //   category: "Verification Mail",
  //   attachments: [
  //     {
  //       filename: "welcome.png",
  //       content_id: "welcome",
  //       disposition: "inline",
  //       content: welcomeImage,
  //       type: "image/png",
  //     },
  //     {
  //       filename: "logo1.png",
  //       content_id: "logo",
  //       disposition: "inline",
  //       content: logoImage,
  //       type: "image/png",
  //     },
  //   ],
  // });
  // .then(console.log, console.error);

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "1f8f373d-f4ed-4c3e-82b7-77262b8dfd79",
    template_variables: {
      test_user_name: name,
      Test_Token: token,
      company_info_address: "ON, Canada",
      company_info_city: "North York",
      company_info_country: "CA",
    },
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const { link, email } = options;

  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: AUTH_EMAIL,
    name: "Password Reset",
  };
  const recipients = [
    {
      email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "8618af6a-ef0d-45de-84cf-38cd4ce69c60",
    template_variables: {
      Test_user_email: email,
      password_reset_link: link,
      company_info_address: "ON, Canada",
      company_info_city: "North York",
      company_info_country: "CA",
    },
  });
};

export const sendPassResetSeccuessEmail = async (
  name: string,
  email: string
) => {
  const client = new MailtrapClient({
    token: MAILTRAP_TOKEN,
  });

  const sender = {
    email: AUTH_EMAIL,
    name: "Password Reset Successfull",
  };
  const recipients = [
    {
      email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    template_uuid: "e5e797eb-c614-47cf-bfe1-0a0d26d812c8",
    template_variables: {
      Test_user_name: name,
      test_user_email: email,
      signin_link: SIGN_IN_URL,
      company_info_city: "North York",
      company_info_country: "CA",
    },
  });

  // sending mail using SMTP mailtrap
  // const transport = generateMailTransporter();

  // const message = `Dear ${name}, Password updated Sucessfully, sign in with your new password`;

  // transport.sendMail({
  //   to: email,
  //   from: VERIFICATION_EMAIL,
  //   subject: "Passwprd Reset Successfully",
  //   html: generateTemplate({
  //     title: "Your New Password",
  //     message,
  //     logo: "cid:logo", //content ID
  //     banner: "cid:forget_password",
  //     link: SIGN_IN_URL,
  //     btnTitle: "Log in",
  //   }),
  //   attachments: [
  //     {
  //       filename: "logo1.png",
  //       path: path.join(__dirname, "../mail/images/logo1.png"),
  //       cid: "logo",
  //     },
  //     {
  //       filename: "forget_password.png",
  //       path: path.join(__dirname, "../mail/images/forget_password.png"),
  //       cid: "forget_password",
  //     },
  //   ],
  // });
};
