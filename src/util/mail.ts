import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.config';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async (
    to: string,
    subject: string,
    htmlContent: string
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dangkyyt4@gmail.com', // generated ethereal user
            pass: 'nxjywpjwoynmpxer', // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'pizzarestaurant@gmail.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: htmlContent,
    });
    return transporter.sendMail(info);
};
