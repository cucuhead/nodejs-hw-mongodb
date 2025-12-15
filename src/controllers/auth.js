import { registerService,loginService,refreshService ,logoutService  } from '../services/auth.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';


export const registerController = async (req, res, next) => {
  try {
    console.log('req.body: ', req.body);
    const data = await registerService(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const accessToken = await loginService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    // Çerezden refresh token al
    const { refreshToken } = req.cookies;

    // Servisi çağır
    const tokens = await refreshService(refreshToken);

    // Yeni refresh token çerez olarak gönder (httpOnly)
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    // Access token yanıt gövdesinde dön
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    // Servisi çağır
    await logoutService(refreshToken);

    // Çerezi temizle
    res.clearCookie('refreshToken');

    // Başarılı çıkış, 204 No Content
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
console.log('Reset link:', resetLink);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>
          Click the link below to reset your password:
        </p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  } catch (error) {
      console.log('SMTP sendMail error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let payload;

  try {
    payload = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
