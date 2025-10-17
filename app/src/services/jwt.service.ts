import * as jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';


export interface JWTPayload {
  id_user: number;
  role_id: number; 
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const token = jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRES_IN,
      issuer: 'FHL-Logistics-API',
      audience: 'FHL-Client'
    } as jwt.SignOptions);
    return token;
  } catch (error) {
    throw new Error(`Error generating token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


export const verifyToken = (token: string): JWTPayload | null => {
  try {
    // The explicit casting avoids the need for 'unknown as' in the middleware
    const decoded = jwt.verify(token, envConfig.JWT_SECRET, {
      issuer: 'FHL-Logistics-API',
      audience: 'FHL-Client'
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};
