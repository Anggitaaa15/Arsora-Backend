import { resolve } from "node:dns";
import cloudinary from "../config/cloudinary";
import { error } from "node:console";

// Helper upload ke cloudinary via stream buffer
export const uploadToCloudinary = (
  fileBuffer: Buffer,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "arsora-product", // Nama folder tujuan
        resource_type: "image", // Eksplisit tentukan tipe resource sebagai gambar
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
    uploadStream.end(fileBuffer);
  });
};

//  DELETE FROM CLOUDINARY
export const deleteFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
};
