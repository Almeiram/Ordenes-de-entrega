import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { 
    verifyToken, isAdmin, isAdminOrAnalyst, validateOrderStatus 
} from '../middleware/auth.middleware';
import * as Controller from '../controllers/auth.controller';

const router = Router();

// ------------------------------------
// 1. Swagger Setup (Documentación)
// ------------------------------------

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FHL Logistics API',
            version: '1.0.0',
            description: 'API REST para la gestión de órdenes de entrega.',
        },
        servers: [{ url: 'http://localhost:3000/api' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Definition de schemas for Swagger
                Cliente: {
                    type: 'object',
                    properties: {
                        cedula: { type: 'string' },
                        nombre: { type: 'string' },
                        correo: { type: 'string' },
                        direccion: { type: 'string' },
                    },
                    required: ['cedula', 'nombre', 'correo', 'direccion'],
                },
                OrdenCreate: {
                    type: 'object',
                    properties: {
                        clienteId: { type: 'number' },
                        productoId: { type: 'number' },
                        bodegaId: { type: 'number' },
                        cantidad: { type: 'number' },
                        fechaEntregaEstimada: { type: 'string', format: 'date' },
                    },
                    required: ['clienteId', 'productoId', 'bodegaId', 'cantidad'],
                },
                OrdenUpdateStatus: {
                    type: 'object',
                    properties: {
                        estado: { 
                            type: 'string', 
                            enum: ['pendiente', 'en tránsito', 'entregada', 'cancelada'],
                            description: 'Nuevo estado de la orden.'
                        },
                    },
                    required: ['estado'],
                },
                Login: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'admin@fhl.com' },
                        password: { type: 'string', example: '123456' },
                    },
                    required: ['username', 'password'],
                }
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts', './src/routes/index.ts'], // Rutas donde buscará JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ------------------------------------
// 2. Auth Routes
// ------------------------------------

/**
 * @swagger
 * tags:
 * name: Autenticación
 * description: Registro e inicio de sesión de usuarios (Admin/Analyst)
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * tags: [Autenticación]
 * summary: Registra un nuevo usuario
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username: { type: 'string', example: 'nuevo@fhl.com' }
 * password: { type: 'string', example: 'securepass' }
 * role: { type: 'string', enum: ['admin', 'analyst'], example: 'analyst' }
 * responses:
 * 201: { description: Usuario registrado con éxito. }
 * 400: { description: Error de validación o usuario existente. }
 */
router.post('/auth/register', Controller.registerUser);

/**
 * @swagger
 * /auth/login:
 * post:
 * tags: [Autenticación]
 * summary: Inicia sesión y retorna un JWT
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Login'
 * responses:
 * 200:
 * description: Inicio de sesión exitoso.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token: { type: 'string' }
 * user: { type: 'object', properties: { id: { type: 'number' }, username: { type: 'string' }, role: { type: 'string' } } }
 * 401: { description: Credenciales inválidas. }
 */
router.post('/auth/login', Controller.loginUser);


// ------------------------------------
// 3. Clientes Routes (Protegidas)
// ------------------------------------

/**
 * @swagger
 * tags:
 * name: Clientes
 * description: Gestión de clientes y direcciones de entrega
 */

/**
 * @swagger
 * /clientes:
 * get:
 * tags: [Clientes]
 * summary: Lista todos los clientes
 * security: [{ bearerAuth: [] }]
 * responses:
 * 200: { description: Lista de clientes. }
 * 401: { description: No autorizado. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 * post:
 * tags: [Clientes]
 * summary: Crea un nuevo cliente
 * security: [{ bearerAuth: [] }]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cliente'
 * responses:
 * 201: { description: Cliente creado con éxito. }
 * 400: { description: Cédula duplicada. }
 * 403: { description: Acceso denegado (requiere Admin). }
 */
router.route('/clientes')
    .get(verifyToken, isAdminOrAnalyst, Controller.listClientes)
    .post(verifyToken, isAdmin, Controller.createCliente);

/**
 * @swagger
 * /clientes/search:
 * post:
 * tags: [Clientes]
 * summary: Busca un cliente por cédula (documento de identificación)
 * security: [{ bearerAuth: [] }]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * cedula: { type: 'string', example: '10000000' }
 * responses:
 * 200: { description: Cliente encontrado. }
 * 404: { description: Cliente no encontrado. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 */
router.post('/clientes/search', verifyToken, isAdminOrAnalyst, Controller.searchClienteByCedula);

// ------------------------------------
// 4. Bodegas Routes (Protegidas)
// ------------------------------------

/**
 * @swagger
 * tags:
 * name: Bodegas
 * description: Gestión de bodegas y stock
 */

/**
 * @swagger
 * /bodegas/active:
 * get:
 * tags: [Bodegas]
 * summary: Lista todas las bodegas activas con su stock
 * security: [{ bearerAuth: [] }]
 * responses:
 * 200: { description: Lista de bodegas activas. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 */
router.get('/bodegas/active', verifyToken, isAdminOrAnalyst, Controller.listActiveBodegas);

/**
 * @swagger
 * /bodegas/toggle-active/{id}:
 * put:
 * tags: [Bodegas]
 * summary: Activa o inactiva una bodega
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: 'integer' }
 * description: ID de la bodega
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * isActive: { type: 'boolean', example: false }
 * responses:
 * 200: { description: Estado de bodega actualizado. }
 * 404: { description: Bodega no encontrada. }
 * 403: { description: Acceso denegado (requiere Admin). }
 */
router.put('/bodegas/toggle-active/:id', verifyToken, isAdmin, Controller.toggleBodegaActiveStatus);

// ------------------------------------
// 5. Productos Routes (Protegidas)
// ------------------------------------

/**
 * @swagger
 * tags:
 * name: Productos
 * description: Gestión de productos
 */

/**
 * @swagger
 * /productos/{codigo}:
 * get:
 * tags: [Productos]
 * summary: Obtiene la información de un producto por su código
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: codigo
 * required: true
 * schema: { type: 'string' }
 * description: Código del producto
 * responses:
 * 200: { description: Producto encontrado. }
 * 404: { description: Producto no encontrado. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 * * /productos/{id}:
 * delete:
 * tags: [Productos]
 * summary: Elimina un producto de forma lógica (establece isDeleted=true)
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: 'integer' }
 * description: ID del producto a eliminar
 * responses:
 * 200: { description: Producto eliminado lógicamente. }
 * 404: { description: Producto no encontrado. }
 * 403: { description: Acceso denegado (requiere Admin). }
 */
router.get('/productos/:codigo', verifyToken, isAdminOrAnalyst, Controller.getProductoByCodigo);
router.delete('/productos/:id', verifyToken, isAdmin, Controller.softDeleteProducto);


// ------------------------------------
// 6. Ordenes Routes (Protegidas)
// ------------------------------------

/**
 * @swagger
 * tags:
 * name: Órdenes de Entrega
 * description: Ciclo de vida de las órdenes
 */

/**
 * @swagger
 * /ordenes:
 * post:
 * tags: [Órdenes de Entrega]
 * summary: Crea una nueva orden de entrega (requiere stock en bodega)
 * security: [{ bearerAuth: [] }]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/OrdenCreate'
 * responses:
 * 201: { description: Orden creada y stock actualizado. }
 * 400: { description: Stock insuficiente o validación fallida. }
 * 404: { description: Cliente/Producto/Bodega no encontrado. }
 * 403: { description: Acceso denegado (requiere Admin). }
 * * /ordenes/historial:
 * get:
 * tags: [Órdenes de Entrega]
 * summary: Retorna el historial de todas las órdenes registradas
 * security: [{ bearerAuth: [] }]
 * responses:
 * 200: { description: Historial de órdenes. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 */
router.post('/ordenes', verifyToken, isAdmin, Controller.createOrden);
router.get('/ordenes/historial', verifyToken, isAdminOrAnalyst, Controller.listAllOrdenes);

/**
 * @swagger
 * /ordenes/{id}/status:
 * put:
 * tags: [Órdenes de Entrega]
 * summary: Cambia el estado de una orden existente
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: 'integer' }
 * description: ID de la orden
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/OrdenUpdateStatus'
 * responses:
 * 200: { description: Estado de orden actualizado. }
 * 400: { description: Estado inválido o la orden ya está finalizada. }
 * 404: { description: Orden no encontrada. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 */
router.put('/ordenes/:id/status', verifyToken, isAdminOrAnalyst, validateOrderStatus, Controller.updateOrdenStatus);

/**
 * @swagger
 * /ordenes/cliente/{clienteId}:
 * get:
 * tags: [Órdenes de Entrega]
 * summary: Consulta el historial de órdenes de un cliente específico
 * security: [{ bearerAuth: [] }]
 * parameters:
 * - in: path
 * name: clienteId
 * required: true
 * schema: { type: 'integer' }
 * description: ID del cliente
 * responses:
 * 200: { description: Historial de órdenes del cliente. }
 * 404: { description: No se encontraron órdenes para el cliente. }
 * 403: { description: Acceso denegado (requiere Admin/Analyst). }
 */
router.get('/ordenes/cliente/:clienteId', verifyToken, isAdminOrAnalyst, Controller.getOrdenesByClienteId);

export default router;
