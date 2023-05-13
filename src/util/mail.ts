import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async (
    to: string,
    subject: string,
    htmlContent: string
) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    const info = {
        from: process.env.EMAIL_FROM_ADDRESS, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: htmlContent,
    };
    // send mail with defined transport object
    return await transporter.sendMail(info);
};
