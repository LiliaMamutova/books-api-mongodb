import {v2 as cloudinary} from "cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

cloudinary.config({
  secure: true,
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function saveFileToCloudinary(buffer, userId) {
  const uploadOptions = {
    folder: "books-app/attach",
    public_id: `attach_${userId}`,
    overwrite: true,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error)
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

