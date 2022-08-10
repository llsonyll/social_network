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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const sendMail = (mailInfo, mailTo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(mailTo);
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: "vavatyni@gmail.com",
            pass: "nlsbenyeedlvxfhb",
        },
    });
    const output = `
      <p>You have a new message from SN</p>
      <h3> ${mailInfo.title} </h3>
      <h3> Message </h3>
      <ul>
        ${mailInfo.message}        
      </ul>
      <br/>
      <p>Visit us <a href="${mailInfo.link}" target="_blank"> here </a></p>
      `;
    const mailOptions = {
        from: "Social Network <vavatyni@gmail.com>",
        to: mailTo,
        subject: `Social Network ${mailInfo.subject}`,
        html: output,
    };
    let resp = {
        error: false,
        success: false,
        message: "",
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            resp = { error: true, success: false, message: "error message" };
        }
        else {
            console.log("Email sent: " + info.response);
            resp = {
                error: false,
                success: true,
                message: "Email sent: " + info.response,
            };
        }
    });
    return resp;
});
exports.sendMail = sendMail;
