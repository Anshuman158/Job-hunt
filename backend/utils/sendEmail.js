import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const isSmtpConfigured = () => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    return Boolean(
        SMTP_HOST &&
        SMTP_USER &&
        SMTP_PASS &&
        SMTP_HOST !== "smtp.example.com"
    );
};

/**
 * Sends an email using Nodemailer (with development console fallback).
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<{ success: boolean, messageId?: string, preview?: boolean }>}
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    if (!isSmtpConfigured()) {
        console.log("\n╔══════════════════════════════════════════════════════════════");
        console.log(`║ 📧 [DEV EMAIL MOCK]`);
        console.log(`║ To: ${to}`);
        console.log(`║ Subject: ${subject}`);
        console.log(`║ Body:\n${text || html}`);
        console.log("╚══════════════════════════════════════════════════════════════\n");
        return { success: true, preview: true };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Job Hunt" <no-reply@jobhunt.io>`,
        to,
        subject,
        text: text || html.replace(/<[^>]*>?/gm, ""),
        html
    });

    return { success: true, messageId: info.messageId };
};

export default sendEmail;

