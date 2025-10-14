// src/services/jwt.service.ts
import * as jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';

/**
 * JWT payload interface.
 * Defines the structure of the data embedded in the JWT for user authentication.
 */
export interface JWTPayload {
  id_user: number;
  roleName: string; // The role name (e.g., 'administrador')
  iat?: number;
  exp?: number;
}

/**
 * Generates a signed JWT token containing user authentication data.
 *
 * @param payload - The user data to embed in the token (id_user, roleName)
 * @returns JWT token as string
 */
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

/**
 * Verifies and decodes a JWT token.
 *
 * @param token - The JWT token to verify
 * @returns The decoded JWTPayload if valid, or null if invalid/expired
 */
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

/**
 * Extracts the JWT token from an HTTP Authorization header.
 *
 * @param authHeader - The value of the Authorization header (e.g., 'Bearer <token>')
 * @returns The token string if present, or null if not found/invalid
 */
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
