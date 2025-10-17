import { Router } from "express";
import { getAllRoles } from "../controllers/role.controller";

const router = Router();
/**
 * @openapi
 * tags:
 *   name: Roles
 *   description: Endpoints for managing roles
 */

/**
 * @openapi
 * /rol/roles:
 *   get:
 *     summary: Get all roles
 *     description: Returns a list of all roles in the system.
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Administrador
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.get("/roles", getAllRoles);

export default router;