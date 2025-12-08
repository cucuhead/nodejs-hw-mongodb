// src/middlewares/errorHandler.js
import { isHttpError } from 'http-errors';

// 4 argümanlı hata işleyici middleware
export const errorHandler = (err, req, res, next) => {
  // HTTP hatalarını yakala (örneğin 404)
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.data,
    });
  }

  // Varsayılan sunucu hatası (500)
  const status = 500;
  res.status(status).json({
    status,
    message: 'Something went wrong',
    data: err.message, // Hata nesnesinden alınan mesaj
  });
};