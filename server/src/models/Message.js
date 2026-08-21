import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
    // Records whether the notification email actually went out.
    emailed: { type: Boolean, default: false },
    emailError: { type: String, default: "" },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
