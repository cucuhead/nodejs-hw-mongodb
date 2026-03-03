import cloudinary from './cloudinary.js';

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'contacts' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};
