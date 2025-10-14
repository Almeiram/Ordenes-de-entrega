import { Request, Response } from 'express';
import RoleDAO from '../Persistence/roles/role.dao'; 
import { CreateRoleDTO } from '../Persistence/roles/role.dto'; 
import { ValidationError } from 'sequelize';

export class RoleController {

    public static async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await RoleDAO.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            console.error('Error getting roles:', error);
            res.status(500).json({ message: 'Internal server error while getting roles.' });
        }
    }

    /**
     * Obtiene un rol por su ID.
     */
    public static async getRoleById(req: Request, res: Response): Promise<void> {
        const id_role = parseInt(req.params.id, 10);

        if (isNaN(id_role)) {
            res.status(400).json({ message: 'Invalid role ID.' });
            return;
        }

        try {
            const role = await RoleDAO.getRoleById(id_role);

            if (role) {
                res.status(200).json(role);
            } else {
                res.status(404).json({ message: `Role with ID ${id_role}not found.` });
            }
        } catch (error) {
            console.error(`Error fetching role with ID ${id_role}:`, error);
            res.status(500).json({ message: 'Internal Server Error.' });
        }
    }

    /**
     * Crea un nuevo rol.
     */
    public static async createRole(req: Request, res: Response): Promise<void> {
        // Validación básica de los datos de entrada
        const roleData: CreateRoleDTO = req.body;

        if (!roleData.name) {
            res.status(400).json({ message: 'El campo "name" es requerido.' });
            return;
        }

        try {
            const newRole = await RoleDAO.createRole(roleData);
            // Retornamos 201 Created junto con el nuevo objeto
            res.status(201).json(newRole);
        } catch (error) {
            // Manejo de errores específicos de Sequelize (ej. unique constraint)
            if (error instanceof ValidationError) {
                res.status(400).json({ message: 'Error de validación: el nombre del rol ya existe o los datos son inválidos.', details: error.errors.map(e => e.message) });
            } else {
                console.error('Error creating role:', error);
                res.status(500).json({ message: 'Error interno del servidor al crear el rol.' });
            }
        }
    }

    /**
     * Actualiza un rol existente.
     */
    public static async updateRole(req: Request, res: Response): Promise<void> {
        const id_role = parseInt(req.params.id, 10);
        const updateData: Partial<CreateRoleDTO> = req.body;

        if (isNaN(id_role)) {
            res.status(400).json({ message: 'ID de rol inválido.' });
            return;
        }

        try {
            const updatedRole = await RoleDAO.updateRole(id_role, updateData);

            if (updatedRole) {
                res.status(200).json(updatedRole);
            } else {
                res.status(404).json({ message: `Rol con ID ${id_role} no encontrado.` });
            }
        } catch (error) {
             if (error instanceof ValidationError) {
                res.status(400).json({ message: 'Error de validación: el nombre del rol ya existe o los datos son inválidos.', details: error.errors.map(e => e.message) });
            } else {
                console.error(`Error updating role with ID ${id_role}:`, error);
                res.status(500).json({ message: 'Error interno del servidor al actualizar el rol.' });
            }
        }
    }

    /**
     * Desactiva (borrado lógico) un rol.
     */
    public static async deleteRole(req: Request, res: Response): Promise<void> {
        const id_role = parseInt(req.params.id, 10);

        if (isNaN(id_role)) {
            res.status(400).json({ message: 'ID de rol inválido.' });
            return;
        }

        try {
            const wasDeleted = await RoleDAO.deleteRole(id_role); // Llama a la función de borrado lógico

            if (wasDeleted) {
                // 204 No Content es el código estándar para una eliminación exitosa sin cuerpo de respuesta
                res.status(204).send(); 
            } else {
                res.status(404).json({ message: `Rol con ID ${id_role} no encontrado o ya estaba inactivo.` });
            }
        } catch (error) {
            console.error(`Error deleting role with ID ${id_role}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al desactivar el rol.' });
        }
    }
}