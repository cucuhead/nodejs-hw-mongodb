// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    // Bearer token kısmını al
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createHttpError(401, 'Token missing');
    }

    // Token doğrula
    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw createHttpError(401, 'Access token expired or invalid');
    }

    // Kullanıcıyı bul
    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Kullanıcıyı request objesine ekle
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
