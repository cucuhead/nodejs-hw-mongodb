// src/utils/ctrlWrapper.js

export const ctrlWrapper = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    // Hatayı errorHandler middleware'ine ilet
    next(error);
  }
};