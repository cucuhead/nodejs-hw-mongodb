import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),   // ← DÜZELT
  email: Joi.string().email().min(3).max(40).required(),
  contactType: Joi.string().valid("work", "home", "personal").required(),
  isFavourite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
 phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(40),
  contactType: Joi.string().valid("work", "home", "personal"),
  isFavourite: Joi.boolean(),
}).min(1);
