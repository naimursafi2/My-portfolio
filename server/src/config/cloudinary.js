import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "./env.js";

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

/** Uploads an in-memory file buffer to Cloudinary and resolves with the result. */
export const uploadBuffer = (buffer, { folder = env.cloudinary.folder, publicId } = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        transformation: [{ width: 1600, height: 1000, crop: "limit" }, { quality: "auto" }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

/** Best-effort delete; a failure here must never break the surrounding request. */
export const destroyImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn(`[cloudinary] could not delete ${publicId}: ${error.message}`);
  }
};

export { cloudinary };
