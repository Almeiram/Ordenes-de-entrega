// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { generateToken } from '../services/jwt.service';
import User from '../models/user.model';
import Role from '../models/role.model';
import Access from '../models/access.model';
import sequelize from '../config/database';
import { checkDuplicateUserDocument } from '../middleware/validation.middleware'; // Reuse validation

const SALT_ROUNDS = 10;

/**
 * @route POST /api/v1/auth/register
 * @description Registers a new user (Admin or Analyst) (Requisito 1a).
 */
export const register = async (req: Request, res: Response) => {
    const { fullname, document_number, password, roleName } = req.body;
    
    // Basic validation
    if (!fullname || !document_number || !password || !roleName) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    }
    
    // NOTE: checkDuplicateUserDocument middleware should handle document_number validation before this

    const transaction = await sequelize.transaction();

    try {
        // 1. Find Role
        const role = await Role.findOne({ where: { name: roleName.toLowerCase() } });
        if (!role) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid role. Must be "administrador" or "analista".' });
        }
        
        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        // 3. Create Access credentials
        const access = await Access.create({
            password_hash: hashedPassword,
        }, { transaction });

        // 4. Create User
        const newUser = await User.create({
            fullname,
            document_number,
            access_id: access.get('id_access'),
            role_id: role.get('id_role'), // FK to Role
            is_active: true,
        }, { transaction });
        
        await transaction.commit();

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id_user: newUser.get('id_user'),
                fullname: newUser.get('fullname'),
                role: role.get('name'),
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error during user registration.' });
    }
};


/**
 * @route POST /api/v1/auth/login
 * @description Allows a registered user to log in and obtain a JWT (Requisito 1b).
 */
export const login = async (req: Request, res: Response) => {
    const { document_number, password } = req.body; 

    if (!document_number || !password) {
        return res.status(400).json({ message: 'Document number and password are required.' });
    }

    try {
        // 1. Find User, their Access and their associated Role
        const user = await User.findOne({
            where: { document_number, is_active: true },
            include: [
                { 
                    model: Access, 
                    as: 'access_credentials',
                },
                {
                    model: Role,
                    as: 'role',
                }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or user is inactive.' });
        }
        
        // 2. Verify Password
        const accessInstance = user.get('access_credentials') as Access;
        const storedPasswordHash = accessInstance.get('password_hash'); 
        
        const passwordMatch = await bcrypt.compare(password, storedPasswordHash); 
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Generate JWT Payload
        const roleName = user.get('role').get('name') as string;
        
        const payload = {
            id_user: user.get('id_user'),
            roleName: roleName,
        };
        
        const token = generateToken(payload);

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id_user: user.get('id_user'),
                fullname: user.get('fullname'),
                role: roleName,
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error while logging in.' });
    }
};

export default {
    register,
    login,
};
