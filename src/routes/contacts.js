// src/routes/contacts.js
import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,  // Yeni
  updateContactController,  // Yeni
  deleteContactController,  // Yeni
} from '../controllers/contacts.js';

const router = Router();

// GET /contacts
console.log('Contacts router initialized')
router.get('/', getAllContactsController);

// POST /contacts (Adım 3)
router.post('/', createContactController);

// GET /contacts/:contactId
router.get('/:contactId', getContactByIdController);

// PATCH /contacts/:contactId (Adım 4)
router.patch('/:contactId', updateContactController);

// DELETE /contacts/:contactId (Adım 5)
router.delete('/:contactId', deleteContactController);



export const contactsRouter = router;