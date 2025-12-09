// src/routes/contacts.js
import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";

const router = Router();

console.log('Contacts router initialized');

// GET /contacts (pagination + sorting burada olacak)
router.get('/', getAllContactsController);

// POST /contacts → VALIDATION EKLENMİŞ HALİ
router.post(
  '/',
  validateBody(createContactSchema),
  createContactController
);

// GET /contacts/:contactId → ID VALIDATION EKLENDİ
router.get(
  '/:contactId',
  isValidId,
  getContactByIdController
);

// PATCH /contacts/:contactId → ID + BODY VALIDATION
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContactController
);

// DELETE /contacts/:contactId → ID VALIDATION
router.delete(
  '/:contactId',
  isValidId,
  deleteContactController
);

export const contactsRouter = router;
