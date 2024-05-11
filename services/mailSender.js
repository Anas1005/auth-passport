import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailSender = async (email, title, body) => {
    console.log("Sending email to: ", email);
    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Sending the email
        const info = await transporter.sendMail({
            from: 'Tawk || OTP Verification',
            to: email,
            subject: title,
            html: body
        });

        console.log("Email sent:", info);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
};

export default mailSender;
