"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPassResetSeccuessEmail = exports.sendForgetPasswordLink = exports.sendVerificationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const variables_1 = require("../utils/variables");
const mailtrap_1 = require("mailtrap");
const generateMailTransporter = () => {
    const transport = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: variables_1.MAILTRAP_USER,
            pass: variables_1.MAILTRAP_PASS,
        },
    });
    return transport;
};
const sendVerificationMail = (token, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = profile;
    const welcomeMessage = `Hi ${name}, welcome`;
    const client = new mailtrap_1.MailtrapClient({
        token: variables_1.MAILTRAP_TOKEN,
    });
    const sender = {
        email: variables_1.VERIFICATION_EMAIL,
        name: "Verification MaxiPlay",
    };
    const recipients = [
        {
            email,
        },
    ];
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
});
exports.sendVerificationMail = sendVerificationMail;
const sendForgetPasswordLink = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, email } = options;
    const client = new mailtrap_1.MailtrapClient({
        token: variables_1.MAILTRAP_TOKEN,
    });
    const sender = {
        email: variables_1.AUTH_EMAIL,
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
});
exports.sendForgetPasswordLink = sendForgetPasswordLink;
const sendPassResetSeccuessEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mailtrap_1.MailtrapClient({
        token: variables_1.MAILTRAP_TOKEN,
    });
    const sender = {
        email: variables_1.AUTH_EMAIL,
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
            signin_link: variables_1.SIGN_IN_URL,
            company_info_city: "North York",
            company_info_country: "CA",
        },
    });
});
exports.sendPassResetSeccuessEmail = sendPassResetSeccuessEmail;
