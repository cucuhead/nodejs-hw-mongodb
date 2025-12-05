import { Contact } from '../db/Contact.js';

// Tüm iletişimleri veritabanından çeken fonksiyon
export const getAllContacts = async () => {
  // .find() metodu tüm belgeleri çeker
  const contacts = await Contact.find();
  return contacts;
};

// Belirli bir ID ile iletişimi veritabanından çeken fonksiyon (Adım 6)
export const getContactById = async (contactId) => {
  // Mongoose'un findById metodu ID'ye göre belgeyi çeker
  const contact = await Contact.findById(contactId);
  return contact;
};