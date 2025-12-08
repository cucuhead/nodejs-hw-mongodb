// src/controllers/contacts.js
import createHttpError from 'http-errors';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// Tüm kişileri dönen controller
export const getAllContactsController = ctrlWrapper(async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully fetched all contacts',
    data: contacts,
  });
});

// ID ile bir kişi dönen controller
export const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    // Adım 2.5: 404 hatası oluştur
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully fetched contact',
    data: contact,
  });
});

// Diğer CRUD kontrolörleri sonraki adımlarda eklenecektir...
// Adım 3: Yeni iletişim oluşturma controller (POST /contacts)
export const createContactController = ctrlWrapper(async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

// Adım 4: Mevcut iletişimi güncelleme controller (PATCH /contacts/:contactId)
export const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await updateContact(contactId, req.body);

  if (!contact) {
    // Adım 4.5: 404 hatası oluştur
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
});

// Adım 5: Mevcut iletişimi silme controller (DELETE /contacts/:contactId)
export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    // Adım 5.3: 404 hatası oluştur
    throw createHttpError(404, 'Contact not found');
  }

  // Başarılı silme durumunda 204 durumu ve boş yanıt gövdesi
  res.status(204).send();
});
// ...