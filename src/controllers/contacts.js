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
  let { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

  page = Number(page);
  perPage = Number(perPage);

  // Filtreler
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sortOptions = {
    [sortBy]: sortOrder === 'desc' ? -1 : 1,
  };

  // userId filtresi ekle
  const { contacts, totalItems } = await getAllContacts({
    userId: req.user._id,
    filter,
    sortOptions,
    page,
    perPage,
  });

  const totalPages = Math.ceil(totalItems / perPage);

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
});

// ID ile bir kişi dönen controller
export const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully fetched contact',
    data: contact,
  });
});

// Yeni iletişim oluşturma controller
export const createContactController = ctrlWrapper(async (req, res) => {
  const contact = await createContact(req.body, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

// Mevcut iletişimi güncelleme controller
export const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await updateContact(contactId, req.user._id, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
});

// Mevcut iletişimi silme controller
export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
});
