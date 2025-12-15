// src/middlewares/notFoundHandler.js
import createHttpError from 'http-errors';

// Bu middleware tüm rotaların sonunda çalışır
export const notFoundHandler = (req, res, next) => {
  // http-errors kullanarak 404 hatası oluştur ve errorHandler'a gönder
  next(createHttpError(404, 'Route not found'));
};