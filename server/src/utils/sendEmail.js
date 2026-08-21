import nodemailer from "nodemailer";
import { env, isEmailConfigured } from "../config/env.js";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = env.smtp.host
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port || 587,
        secure: (env.smtp.port || 587) === 465,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      })
    : nodemailer.createTransport({
        service: env.smtp.service,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      });

  return transporter;
};

export const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) return { ok: false, error: "SMTP credentials are not set" };
  try {
    await getTransporter().verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const sendEmail = async ({ subject, text, html, replyTo }) => {
  if (!isEmailConfigured()) {
    throw new Error("SMTP credentials are not set (SMTP_USER / SMTP_PASS)");
  }

  return getTransporter().sendMail({
    from: env.smtp.from || env.smtp.user,
    to: env.smtp.to,
    replyTo,
    subject,
    text,
    html,
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const buildContactEmail = ({ name, email, message }) => ({
  subject: `New portfolio message from ${name}`,
  replyTo: email,
  text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
  html: `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">New message from your portfolio</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px"><strong>Email:</strong>
        <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <div style="padding:16px;border-left:3px solid #6366f1;background:#f6f6fb;white-space:pre-wrap">${escapeHtml(
        message
      )}</div>
      <p style="margin:20px 0 0;font-size:12px;color:#666">
        Reply directly to this email to answer ${escapeHtml(name)}.</p>
    </div>`,
});
