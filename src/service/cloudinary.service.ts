
import cloudinary from "../config/cloudinary";

// Helper upload ke Cloudinary via stream buffer
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "arsora-product",
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload gambar gagal"));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete gambar dari Cloudinary
export const deleteFromCloudinary = (
  publicId: string,
): Promise<void> => {
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
