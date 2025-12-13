import { Schema, model } from 'mongoose';

// Kontak Türleri için enum değerleri
const contactTypeEnum = ['work', 'home', 'personal'];

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // unique: true, // E-posta alanı zorunlu değil, bu yüzden unique yapmaya gerek yok.
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeEnum, // Sadece bu üç değerden birini alabilir
      required: true,
      default: 'personal',
    },
     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Modelinize herhangi bir alan eklemediğiniz halde mongoose bunları otomatik ekler:
    // createdAt: Date
    // updatedAt: Date
  },
  {
    // createdAt ve updatedAt alanlarını otomatik olarak ekler
    timestamps: true,
    // Ödeviniz için, koleksiyon adı 'contacts' olarak ayarlanmalıdır.
    collection: 'contacts',
  },
);

export const Contact = model('Contact', contactSchema);