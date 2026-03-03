// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { contactsRouter } from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const PORT = Number(env('PORT', '3000'));

const swaggerDocument = YAML.load(
  `${process.cwd()}/openapi.yaml`
);

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

  // 🔴 ÇOK KRİTİK: swagger static SERVE
  app.use(
    '/api-docs/swagger',
    express.static(path.join(process.cwd(), 'swagger'))
  );

  app.use('/auth', authRouter);

  // Health check
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  // API routes
  app.use('/contacts', contactsRouter);

  // Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  // 404
  app.use(notFoundHandler);

  // Global error
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
