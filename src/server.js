import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import checkEnv from './utils/env.js';
import errorHandler from './middleware/errorHandler.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import rootRouter from './routers/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middleware/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

export const setupServer = async () => {
  const PORT = checkEnv('PORT', '3000');

  const app = express();
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(rootRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
