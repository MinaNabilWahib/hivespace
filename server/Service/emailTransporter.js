const nodemailer = require("nodemailer");
const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.Admin_email,
                pass: process.env.Admin_pass,
            },
        });

        await transporter.sendMail({
            from: process.env.Admin_email,
            to: email,
            subject: subject,
            html: html,
        });
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
/*`<p>Hello,</p>
            <p>A password reset was requested for this email address ${email}. If you requested this reset, click the link below to reset your password:</p>
            <p><a style="background-color:blue; color:white;padding:10px 20px;text-decoration:none; font-weight:bold;border-radius:7px" href="${link}">Reset Your Password</a></p>`*/