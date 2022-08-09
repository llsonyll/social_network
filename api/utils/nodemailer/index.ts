import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

export interface mailInfo {
  title: String;
  message: String;
  link?: String;
  subject: String;
}

export interface mailResponse {
  success: Boolean;
  error: Boolean;
  message: String;
}

export const sendMail = async (
  mailInfo: mailInfo,
  mailTo: any
): Promise<mailResponse> => {
  console.log(mailTo);

  const transporter = createTransport({
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

  const mailOptions: MailOptions = {
    from: "Social Network <vavatyni@gmail.com>",
    to: mailTo,
    subject: `Social Network ${mailInfo.subject}`,
    html: output,
  };

  let resp: mailResponse = {
    error: false,
    success: false,
    message: "",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      resp = { error: true, success: false, message: "error message" };
    } else {
      console.log("Email sent: " + info.response);
      resp = {
        error: false,
        success: true,
        message: "Email sent: " + info.response,
      };
    }
  });

  return resp;
};
