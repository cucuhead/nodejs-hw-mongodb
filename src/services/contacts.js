import { Contact } from '../db/Contact.js';

// ✓ Güncellenmiş getAllContacts (pagination + sort + filter)
export const getAllContacts = async ({ filter, sortOptions, page, perPage }) => {
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter),
  ]);

  return { contacts, totalItems };
};

// ✓ Bunlar aynı şekilde kalıyor
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    ...options,
  });
  return result;
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
