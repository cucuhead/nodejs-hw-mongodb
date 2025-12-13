import { registerService,loginService,refreshService ,logoutService  } from '../services/auth.js';


export const registerController = async (req, res, next) => {
  try {
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
