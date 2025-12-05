import { getAllContacts, getContactById } from '../services/contacts.js';

// GET /contacts rotasının kontrolcüsü (Adım 5)
export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();

    // Ödevde istenen 200 yanıt yapısını döndür
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    // Herhangi bir veritabanı veya sunucu hatasını yakala
    next(err);
  }
};

// GET /contacts/:contactId rotasının kontrolcüsü (Adım 6)
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params; // URL'den :contactId parametresini al

  try {
    const contact = await getContactById(contactId);

    if (!contact) {
      // 5. İletişim bulunamazsa 404 hatası döndür
      // Not: Bu aşamada, geçersiz MongoDB ID'si kontrolü yapmaya gerek yoktur.
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    // 4. İletişim bulunduysa 200 yanıtı döndür
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    // Veritabanı veya sunucu hatalarını yakala
    next(err);
  }
};