// src/services/contacts.js
import { Contact } from '../db/Contact.js';

// ✓ getAllContacts (pagination + sort + filter + userId)
export const getAllContacts = async ({ userId, filter = {}, sortOptions = {}, page = 1, perPage = 10 }) => {
  const skip = (page - 1) * perPage;

  // userId filtresi ekle
  const finalFilter = { ...filter, userId };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(finalFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(finalFilter),
  ]);

  return { contacts, totalItems };
};

// ✓ getContactById (userId ile filtrelenmiş)
export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

// ✓ createContact (userId eklenmiş)
export const createContact = async (payload, userId) => {
  return await Contact.create({ ...payload, userId });
};

// ✓ updateContact (userId filtresi)
export const updateContact = async (contactId, userId, payload, options = {}) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, ...options }
  );
};

// ✓ deleteContact (userId filtresi)
export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
