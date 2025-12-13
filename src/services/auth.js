// src/services/auth.js
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';




// Token gizli anahtarları (env ile değiştirilebilir)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsecret';

// ========================
// Kullanıcı Kayıt Servisi
// ========================
export const registerService = async ({ name, email, password }) => {
  // Aynı e-posta ile kullanıcı var mı kontrol et
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullanıcı oluştur
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Şifreyi geri döndürme
  const userData = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  return userData;
};

// ========================
// Kullanıcı Giriş Servisi
// ========================
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Eski oturumu sil
  await Session.deleteMany({ userId: user._id });

  // Token oluştur
  const accessToken = jwt.sign(
    { userId: user._id },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  // Oturumu kaydet
  const now = new Date();
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000), // 15 dk
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün
  });

  return accessToken;
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  // Mevcut session’ı bul
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  // Token geçerlilik süresini kontrol et
  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  // Kullanıcıyı bul
  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Eski oturumu sil
  await Session.deleteOne({ _id: session._id });

  // Yeni tokenler oluştur
  const newAccessToken = jwt.sign(
    { userId: user._id },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  const newRefreshToken = jwt.sign(
    { userId: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  const now = new Date();
  await Session.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken, // opsiyonel, çerez olarak dönecek
  };
};


export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    // Çerez yoksa zaten oturum yok
    return;
  }

  // Session varsa sil
  await Session.deleteOne({ refreshToken });
};