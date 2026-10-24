const nodemailer = require('nodemailer');

/**
 * Sends a professional confirmation or rejection email using Nodemailer
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject line
 * @param {string} userName - Name of the customer
 * @param {boolean} isAccepted - Whether the order was accepted or rejected
 * @param {string} adminMessage - Personal message from the admin (optional)
 */
const sendEmail = async (to, subject, userName, isAccepted = true, adminMessage = "") => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const isDelivered = subject.toLowerCase().includes('delivered');
    const primaryColor = isDelivered ? '#10b981' : (isAccepted ? '#6366f1' : '#ef4444');
    const statusText = isDelivered ? 'DELIVERED' : (isAccepted ? 'CONFIRMED' : 'DECLINED');
    const statusIcon = isDelivered ? '📦' : (isAccepted ? '✅' : '❌');
    const statusMessage = isDelivered 
        ? `Fresh from the kitchen to your doorstep! Your order from <strong>Dining Dynamics</strong> has been successfully delivered.`
        : (isAccepted 
            ? `Great news! Your order request at <strong>Dining Dynamics</strong> has been officially accepted by our team.`
            : `We regret to inform you that your order request at <strong>Dining Dynamics</strong> could not be accepted at this time.`);

    const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, ${primaryColor} 0%, #1e293b 100%); padding: 40px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Dining Dynamics</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-weight: 500;">Order Status Update</p>
        </div>
        <div style="padding: 40px; background-color: white;">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                ${statusMessage}
            </p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid ${primaryColor};">
                <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Current Status</h3>
                <p style="margin: 5px 0; color: ${isAccepted ? '#10b981' : '#ef4444'}; font-weight: 700; font-size: 18px;">${statusIcon} ${statusText}</p>
                ${adminMessage ? `<p style="margin: 15px 0 0; color: #64748b; font-size: 14px; font-style: italic;">Note: ${adminMessage}</p>` : ''}
            </div>

            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                If you have any questions, please contact our support team.
            </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Dining Dynamics Team</p>
        </div>
    </div>
    `;

    const mailOptions = {
        from: `"Dining Dynamics" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: `Hello ${userName}, your order status is: ${statusText}`,
        html: htmlTemplate,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[Email Service] Error sending email: ${error.message}`);
        throw error;
    }
};

/**
 * Sends a welcome email to newly registered delivery personnel with their login credentials
 * @param {string} to - Recipient's email address
 * @param {string} userName - Name of the delivery boy
 * @param {string} email - Login email
 * @param {string} password - Login password
 */
const sendCredentialEmail = async (to, userName, email, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #1e293b 100%); padding: 40px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Welcome to the Fleet! 🛵</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-weight: 500;">Dining Dynamics Delivery Team</p>
        </div>
        <div style="padding: 40px; background-color: white;">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                You have been successfully registered as a delivery partner at <strong>Dining Dynamics</strong>. We are excited to have you on board!
            </p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #6366f1;">
                <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Your Login Credentials</h3>
                <div style="margin: 15px 0;">
                    <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Email ID:</p>
                    <p style="margin: 0; color: #1e293b; font-weight: 700; font-size: 16px;">${email}</p>
                </div>
                <div style="margin: 15px 0;">
                    <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Password:</p>
                    <p style="margin: 0; color: #1e293b; font-weight: 700; font-size: 16px;">${password}</p>
                </div>
            </div>

            <p style="color: #475569; line-height: 1.6; font-size: 15px;">
                Please use these credentials to log into our app and start accepting delivery requests. For security reasons, we recommend keeping this information confidential.
            </p>

            <div style="text-align: center; margin-top: 35px;">
                <a href="#" style="background-color: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Open Delivery Dashboard</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                This is an automated message. If you did not expect this, please ignore it or contact our support.
            </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Dining Dynamics Administrative Team</p>
        </div>
    </div>
    `;

    const mailOptions = {
        from: `"Dining Dynamics" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Welcome to Dining Dynamics - Your Login Credentials',
        text: `Hello ${userName}, welcome to Dining Dynamics. Your login credentials are: Email: ${email}, Password: ${password}`,
        html: htmlTemplate,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Credential email sent to ${to}`);
        return info;
    } catch (error) {
        console.error(`[Email Service] Error sending credential email: ${error.message}`);
        throw error;
    }
};

module.exports = { sendEmail, sendCredentialEmail };
