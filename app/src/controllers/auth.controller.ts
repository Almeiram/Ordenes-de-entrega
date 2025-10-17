import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Access from '../models/access.model';

const JWT_SECRET = process.env.JWT_SECRET || 'OMGNEWTESTJ4J4';
// Is like DTO
interface LoginRequestBody {
    username: string;
    password: string;
}

interface RegisterRequestBody {
    username: string;
    password: string;
    roleId: number;
}

/**
 * Handles user registration logic: creates a new user and returns their data.
 */
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
        return res.status(400).json({ message: 'Username, password and roleId are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await Access.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'The username is already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await Access.create({
            username: username,
            password: hashedPassword,
            role_id: roleId,
            is_active: true,
        });

        // Generate a JWT token
        const payload = {
            id: newUser.id_access,
            roleId: newUser.role_id,
            username: newUser.username,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user_data: {
                id: newUser.id_access,
                username: newUser.username,
                roleId: newUser.role_id
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

/** 
 * Handles login logic: verifies credentials and issues a JWT.
 */
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // 1. Find the access entry by username
        const access = await Access.findOne({
            where: { username }
        });

        if (!access) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 2. Compare the encrypted password
        const isMatch = await bcrypt.compare(password, access.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Create the JWT Payload (matches your middleware interfaces)
        const payload = {
            // Maps to 'id' to match JwtPayload
            id: access.id_access,
            // Maps to 'roleId' to match JwtPayload and checkRole
            roleId: access.role_id,
            username: access.username,
        };

        // 4. Generate the Token (expires in 1 hour)
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Return the response with the token
        return res.status(200).json({
            message: 'Login successful',
            token,
            user_data: {
                id: access.id_access,
                username: access.username,
                roleId: access.role_id
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};