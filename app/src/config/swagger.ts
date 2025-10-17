import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi  from 'swagger-ui-express';
import { Express } from 'express';

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
                url: `http://localhost:3000/api`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDoc = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}