import swaggerJSDoc from 'swagger-jsdoc';
import { envConfig } from './env';

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
                url: `http://localhost:${envConfig.APP_PORT}api-docs`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./src/routes/*.ts']
};

export const swaggerDoc = swaggerJSDoc(options);
