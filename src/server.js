// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { contactsRouter } from './routes/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js'; // Adım 2
import { errorHandler } from './middlewares/errorHandler.js'; // Adım 2

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
const app = express();

  // 1. Standart Middleware'ler
 app.use(express.json());
app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  // 2. Sağlık Kontrolü (Health Check)
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  // 3. ROTALAR
console.log('Contacts Router loaded');


  app.use('/contacts', contactsRouter); 

  // 4. 404 Not Found Handler (Tüm rotalardan sonra)
  // Adım 2.3: Var olmayan yolları yakalar
  app.use(notFoundHandler); 

  // 5. GLOBAL Error Handler (En sonda, 4 argümanlı)
  // Adım 2.2: Hataları standart formata dönüştürür (500, 404, vb.)
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};