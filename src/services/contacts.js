// src/services/contacts.js
import { Contact } from '../db/Contact.js'; // Modelinizi bu şekilde import ettiğinizi varsayıyorum

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

// Adım 3: Yeni iletişim oluşturma servisi
export const createContact = async (payload) => {
  return await Contact.create(payload);
};

// Adım 4: Mevcut iletişimi güncelleme servisi
export const updateContact = async (contactId, payload, options = {}) => {
  // new: true -> güncellenmiş belgeyi döndürür
  const result = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    ...options,
  });
  return result;
};

// Adım 5: Mevcut iletişimi silme servisi
export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};