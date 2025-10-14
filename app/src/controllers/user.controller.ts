import { Request, Response } from 'express';
import UserDAO, { CreateUserWithAccessDTO } from '..//Persistence/users/user.dao'; 
import { CreateUserDTO, UserUpdateDTO } from '../Persistence/users/user.dto'; 

export class UserController {

    public static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserDAO.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error en servidor.' });
        }
    }

    public static async getUserById(req: Request, res: Response): Promise<void> {
        const id_user = parseInt(req.params.id, 10); 

        if (isNaN(id_user)) {
            res.status(400).json({ message: 'ID no válido.' });
            return;
        }

        try {
            const user = await UserDAO.getUserById(id_user);

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: `Usuario ${id_user} no hallado.` });
            }
        } catch (error) {
            console.error(`Error buscando usuario ${id_user}:`, error);
            res.status(500).json({ message: 'Error en servidor.' });
        }
    }

    public static async register(req: Request, res: Response): Promise<void> {
        const data: CreateUserWithAccessDTO = req.body;
        
        try {
            const newUser = await UserDAO.createUserWithAccess(data);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creando usuario con acceso:', error);
            res.status(500).json({ message: 'Error en servidor al crear usuario y acceso.' });
        }
    }

    public static async updateUser(req: Request, res: Response): Promise<void> {
        const id_user = parseInt(req.params.id, 10);
        const updateData: UserUpdateDTO = req.body;

        if (isNaN(id_user)) {
            res.status(400).json({ message: 'ID no válido.' });
            return;
        }

        try {
            const updatedUser = await UserDAO.updateUser(id_user, updateData);

            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ message: `Usuario ${id_user} no hallado.` });
            }
        } catch (error) {
            console.error(`Error actualizando usuario ${id_user}:`, error);
            res.status(500).json({ message: 'Error en servidor al actualizar usuario.' });
        }
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        const id_user = parseInt(req.params.id, 10);

        if (isNaN(id_user)) {
            res.status(400).json({ message: 'ID no válido.' });
            return;
        }

        try {
            const wasDeleted = await UserDAO.deleteUser(id_user); 

            if (wasDeleted) {
                res.status(204).send(); 
            } else {
                res.status(404).json({ message: `Usuario ${id_user} no hallado o ya inactivo.` });
            }
        } catch (error) {
            console.error(`Error desactivando usuario ${id_user}:`, error);
            res.status(500).json({ message: 'Error en servidor al desactivar usuario.' });
        }
    }
}