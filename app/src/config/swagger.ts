import swaggerJSDoc from 'swagger-jsdoc';
import { envConfig } from './env';
import path from 'node:path';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: 'API documentation for user registration and task management'
        },
        servers: [
            {
                url: `http://localhost:${envConfig.APP_PORT}`,
                description: 'Development server'
            }
        ]
    },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../docs/**/*.yaml'),
  ],};

export const swaggerDoc = swaggerJSDoc(options);
