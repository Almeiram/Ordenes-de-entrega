// src/server.ts
import express, { Request, Response } from 'express';
import { envConfig } from './config/env';
import router from './routes/auth.routes'; // Import routes from authentication
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import {swaggerDoc} from './config/swagger'; // Will be generated next
import roleRoutes from "./routes/role.routes";

// Import models to ensure associations are registered
import './models/role.model';
import './models/access.model';
import './models/user.model';
import './models/customer.model';
import './models/product.model';



export const app = express();

// --- Middlewares ---
app.use(cors()); // Enable CORS for development
app.use(express.json()); // Body parser

// --- Routes ---
app.use('/auth', router);
app.use('/rol', roleRoutes);

// --- Swagger Documentation (Requisito 4) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
console.log(`Swagger documentation available at http://localhost:${envConfig.APP_PORT}/api-docs`);

// --- Health Check ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'FHL Logistics API is running.',
        environment: envConfig.NODE_ENV,
        docs: `/api-docs`
    });
});

