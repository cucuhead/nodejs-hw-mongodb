// src/routes/contacts.js
import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { authenticate } from '../middlewares/authenticate.js';

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { upload } from '../middlewares/upload.js';

const router = Router();

console.log('Contacts router initialized');

// GET /contacts (pagination + sorting burada olacak)
router.get('/', authenticate, getAllContactsController);

// POST /contacts → VALIDATION EKLENMİŞ HALİ
router.post(
  '/',
   authenticate,
    upload.single('photo'),
  validateBody(createContactSchema),
  createContactController
);

// GET /contacts/:contactId → ID VALIDATION EKLENDİ
router.get(
  '/:contactId',
   authenticate,
  isValidId,
  getContactByIdController
);

// PATCH /contacts/:contactId → ID + BODY VALIDATION
router.patch(
  '/:contactId',
   authenticate,
   upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  updateContactController
);

// DELETE /contacts/:contactId → ID VALIDATION
router.delete(
  '/:contactId',
   authenticate,
  isValidId,
  deleteContactController
);

export const contactsRouter = router;
