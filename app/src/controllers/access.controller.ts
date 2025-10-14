import { Request, Response } from 'express';
import AccessDAO from '../Persistence/accesses/access.dao';
import { CreateAccessDTO } from '../Persistence/accesses/access.dto';
import { ValidationError } from 'sequelize';

export class AccessController {
    public static async getAllAccesses(req: Request, res: Response): Promise<void> {
        try {
            const accesses = await AccessDAO.getAllAccesses();
            res.status(200).json(accesses);
        } catch (error) {
            console.error('Error al obtener accesos:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener accesos.' });
        }
    }

    public static async getAccessById(req: Request, res: Response): Promise<void> {
        const id_access = parseInt(req.params.id, 10);
        if (isNaN(id_access)) {
            res.status(400).json({ message: 'ID de acceso inválido.' });
            return;
        }
        try {
            const access = await AccessDAO.getAccessById(id_access);
            if (access) {
                res.status(200).json(access);
            } else {
                res.status(404).json({ message: `Acceso con ID ${id_access} no encontrado.` });
            }
        } catch (error) {
            console.error(`Error al obtener acceso con ID ${id_access}:`, error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    public static async createAccess(req: Request, res: Response): Promise<void> {
        const accessData: CreateAccessDTO = req.body;
        if (!accessData.username) {
            res.status(400).json({ message: 'El campo "username" es requerido.' });
            return;
        }
        try {
            const newAccess = await AccessDAO.createAccess(accessData);
            res.status(201).json(newAccess);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.message });
            } else {
                console.error('Error al crear acceso:', error);
                res.status(500).json({ message: 'Error interno del servidor al crear acceso.' });
            }
        }
    }

    public static async updateAccess(req: Request, res: Response): Promise<void> {
        const id_access = parseInt(req.params.id, 10);

        if (isNaN(id_access)) {
            res.status(400).json({ message: 'ID de acceso inválido.' });
            return;
        }

        const updateData: Partial<CreateAccessDTO> = req.body;

        try {
            const updatedAccess = await AccessDAO.updateAccess(id_access, updateData);
            if (updatedAccess) {
                res.status(200).json(updatedAccess);
            } else {
                res.status(404).json({ message: `Acceso con ID ${id_access} no encontrado.` });
            }
        } catch (error) {
            console.error(`Error al actualizar acceso con ID ${id_access}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al actualizar acceso.' });
        }
    }

    public static async deleteAccess(req: Request, res: Response): Promise<void> {
        const id_access = parseInt(req.params.id, 10);

        if (isNaN(id_access)) {
            res.status(400).json({ message: 'ID de acceso inválido.' });
            return;
        }
        try {
            const success = await AccessDAO.deleteAccess(id_access);
            if (success) {
                res.status(200).json({ message: `Acceso con ID ${id_access} desactivado.` });
            } else {
                res.status(404).json({ message: `Acceso con ID ${id_access} no encontrado o ya desactivado.` });
            }

        } catch (error) {
            console.error(`Error al desactivar acceso con ID ${id_access}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al desactivar acceso.' });
        }
    }
}