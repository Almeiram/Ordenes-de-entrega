import { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Access from '../Persistence/accesses/access.model';
import { AccessAttributes } from '../Persistence/accesses/access.model';

const JWT_SECRET = process.env.JWT_SECRET || 'P45T3l1t0D3P0Oll0';
;

interface LoginRequestBody {
    username: string;
    password: string;
}

/**
 * Handles login logic: verifies credentials and issues a JWT.
 */
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Se requieren nombre de usuario y contraseña.' });
    }

    try {
        // Search for login entry by username
        const access = await Access.findOne({ 
            where: { username } 
        }) as AccessAttributes | null; // Casteamos el resultado para tipado

        if (!access) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Compare the encrypted password (assumes bcrypt is being used)
        const isMatch = await bcrypt.compare(password, access.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        //Create the JWT Payload (Aligned with your middleware interfaces)
        const payload = {
            // Maps to 'id' to match JwtPayload
            id: access.id_access, 
            
            // Maps to 'roleId' to match JwtPayload and checkRole
            roleId: access.role_id, 
            
            // You can include other data if they are relevant.
            username: access.username,
        };

        // Generate the Token (expires in 1 hour)
        const token = jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // Return the response with the token
        return res.status(200).json({
            message: 'Login exitoso',
            token,
            user_data: {
                id: access.id_access,
                username: access.username,
                roleId: access.role_id
            }
        });

    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};