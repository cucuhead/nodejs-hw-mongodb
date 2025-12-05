import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

// Adım 5 ve Adım 6 için gerekli kontrolcüler
import { getContactsController, getContactByIdController } from './controllers/contacts.js';

// Ortam değişkenini alın, yoksa 3000 varsayılanını kullanın
const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // CORS ve JSON işleme middleware'leri
  app.use(express.json());
  app.use(cors());

  // Pino Logger middleware'i
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Health Check/Basit Kontrol Rotası
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  // ********** DİĞER ROTLAR BURAYA EKLENMİŞTİR **********

  // Adım 5: Tüm kişileri çekme rotası
  app.get('/contacts', getContactsController);

  // Adım 6: ID'ye göre bir kişiyi çekme rotası <-- YENİ ROTAYI EKLEDİK
  app.get('/contacts/:contactId', getContactByIdController);

  // *******************************************************

  // 404 Not Found (Bulunamayan Rotalar) İşleyici
  // Bu middleware, sadece yukarıdaki rotaların hiçbiri eşleşmediğinde çalışır.
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Hata İşleyici (Error Handler) - Daima en sonda olmalıdır
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  // Sunucuyu Başlatma
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};