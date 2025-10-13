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
const template_1 = require("../mail/template");
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const variables_1 = require("../utils/variables");
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
    const transport = generateMailTransporter();
    const { name, email, userId } = profile;
    const welcomeMessage = `Hi ${name}, welcome too`;
    transport.sendMail({
        to: email,
        from: variables_1.VERIFICATION_EMAIL,
        subject: "Welcome Message",
        html: (0, template_1.generateTemplate)({
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
                path: path_1.default.join(__dirname, "../mail/images/logo1.png"),
                cid: "logo",
            },
            {
                filename: "welcome.png",
                path: path_1.default.join(__dirname, "../mail/images/welcome.png"),
                cid: "welcome",
            },
        ],
    });
});
exports.sendVerificationMail = sendVerificationMail;
const sendForgetPasswordLink = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const { link, email } = options;
    const message = ` use this link to reset password`;
    transport.sendMail({
        to: email,
        from: variables_1.VERIFICATION_EMAIL,
        subject: "Reset Passwprd Link",
        html: (0, template_1.generateTemplate)({
            title: "Forget Password",
            message,
            logo: "cid:logo",
            banner: "cid:forget_password",
            link,
            btnTitle: "Reset Passwprd",
        }),
        attachments: [
            {
                filename: "logo1.png",
                path: path_1.default.join(__dirname, "../mail/images/logo1.png"),
                cid: "logo",
            },
            {
                filename: "forget_password.png",
                path: path_1.default.join(__dirname, "../mail/images/forget_password.png"),
                cid: "forget_password",
            },
        ],
    });
});
exports.sendForgetPasswordLink = sendForgetPasswordLink;
const sendPassResetSeccuessEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const message = `Dear ${name}, Password updated Sucessfully, sign in with your new password`;
    transport.sendMail({
        to: email,
        from: variables_1.VERIFICATION_EMAIL,
        subject: "Passwprd Reset Successfully",
        html: (0, template_1.generateTemplate)({
            title: "Your New Password",
            message,
            logo: "cid:logo",
            banner: "cid:forget_password",
            link: variables_1.SIGN_IN_URL,
            btnTitle: "Log in",
        }),
        attachments: [
            {
                filename: "logo1.png",
                path: path_1.default.join(__dirname, "../mail/images/logo1.png"),
                cid: "logo",
            },
            {
                filename: "forget_password.png",
                path: path_1.default.join(__dirname, "../mail/images/forget_password.png"),
                cid: "forget_password",
            },
        ],
    });
});
exports.sendPassResetSeccuessEmail = sendPassResetSeccuessEmail;
