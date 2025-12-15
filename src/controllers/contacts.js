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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

/* GET ALL */
export const getAllContactsController = ctrlWrapper(async (req, res) => {
  let {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  page = Number(page);
  perPage = Number(perPage);

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sortOptions = {
    [sortBy]: sortOrder === 'desc' ? -1 : 1,
  };

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

/* GET BY ID */
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

/* CREATE */
export const createContactController = ctrlWrapper(async (req, res) => {
  let photo;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    photo = result.secure_url;
  }

  const contact = await createContact(
    {
      ...req.body,
      ...(photo && { photo }),
    },
    req.user._id
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

/* UPDATE */
export const updateContactController = ctrlWrapper(async (req, res) => {
  console.log('update: ', req)
  const { contactId } = req.params;

  let photo;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    photo = result.secure_url;
  }

  const contact = await updateContact(
   contactId,
    req.user._id,
    {
      ...req.body,
      ...(photo && { photo }),
    }
  );
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
});

/* DELETE */
export const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
});
