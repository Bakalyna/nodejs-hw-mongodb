import cloudinary from 'cloudinary';
import checkEnv from './env.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: checkEnv(CLOUDINARY.CLOUD_NAME),
  api_key: checkEnv(CLOUDINARY.API_KEY),
  api_secret: checkEnv(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const resp = await cloudinary.v2.uploader.upload(file.path);
  return resp.secure_url;
};