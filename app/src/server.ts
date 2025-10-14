// src/server.ts
import express, { Request, Response } from 'express';
import { envConfig } from './config/env';
import { syncDatabase } from './config/sync';
import { seedDatabase } from './seeders/initial.seed';
import mainRouter from './routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'; // Will be generated next

// Import models to ensure associations are registered
import './Persistence/roles/role.model';
import './Persistence/accesses/access.model';
import './Persistence/users/user.model';
import './Persistence/customers/customer.model';
import './Persistence/wherehouse/wherehouse.model';
import './Persistence/products/product.model';
import './Persistence/productWhereHouse/productWhereHouse';
import './Persistence/orders/order.model';
import './Persistence/orderItems/orderItem.model';


const app = express();

// --- Middlewares ---
app.use(cors()); // Enable CORS for development
app.use(express.json()); // Body parser

// --- Routes ---
app.use('/api/v1', mainRouter);

// --- Swagger Documentation (Requisito 4) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(`Swagger documentation available at http://localhost:${envConfig.APP_PORT}/api-docs`);

// --- Health Check ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'FHL Logistics API is running.',
        environment: envConfig.NODE_ENV,
        docs: `/api-docs`
    });
});

/**
 * Initializes the database and starts the server.
 */
const startServer = async () => {
    try {
        // Force synchronization only in development or for initial setup
        const forceSync = envConfig.NODE_ENV !== 'production'; 
        
        // 1. Synchronize (Create tables)
        await syncDatabase(forceSync); 
        
        // 2. Seed database (Poblar BD - Requisito 2b)
        await seedDatabase();

        // 3. Start Express server
        app.listen(envConfig.APP_PORT, () => {
            console.log(`Server is running on port ${envConfig.APP_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

// Start the application
startServer();
