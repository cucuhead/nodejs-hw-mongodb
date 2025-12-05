import dotenv from 'dotenv';

dotenv.config();

export const env = (key, defaultValue) => {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} not found.`);
    }
    return defaultValue;
  }

  return value;
};