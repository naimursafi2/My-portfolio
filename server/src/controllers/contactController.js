import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound } from "../utils/ApiError.js";
import { sendEmail, buildContactEmail } from "../utils/sendEmail.js";

export const submitMessage = asyncHandler(async (req, res) => {
  const { name, email, message, website } = req.body;

  // Honeypot: bots fill every field, so accept the request and drop it silently.
  if (website) {
    return res.status(201).json({ success: true, message: "Thanks, your message has been sent." });
  }

  const saved = await Message.create({ name, email, message });

  try {
    await sendEmail(buildContactEmail({ name, email, message }));
    saved.emailed = true;
  } catch (error) {
    // The message is already stored, so a mail failure must not fail the request.
    saved.emailError = error.message;
    console.error("[contact] email delivery failed:", error.message);
  }
  await saved.save();

  res.status(201).json({
    success: true,
    message: "Thanks, your message has been sent.",
    data: { id: saved._id, emailed: saved.emailed },
  });
});

export const listMessages = asyncHandler(async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  const unread = messages.filter((m) => !m.read).length;
  res.json({ success: true, count: messages.length, unread, data: messages });
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: req.body?.read !== false },
    { new: true }
  );
  if (!message) throw notFound("Message not found");
  res.json({ success: true, data: message });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw notFound("Message not found");
  res.json({ success: true, data: { id: req.params.id } });
});
