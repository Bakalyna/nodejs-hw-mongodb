import { SMTP } from '../constants/index.js';
import checkEnv from './env.js';
import  nodemailer  from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: checkEnv(SMTP.SMTP_HOST),
  port: Number(checkEnv(SMTP.SMTP_PORT)),
  auth: {
    user: checkEnv(SMTP.SMTP_USER),
    pass: checkEnv(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
