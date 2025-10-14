
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';

/**
 * JWT payload interface.
 * Defines the structure of the data embedded in the JWT for seller authentication.
 */
export interface JWTPayload {
  id_seller: number;
  username: string;
  role_id: number;
  iat?: number;
  exp?: number;
}

/**
 * Generates a signed JWT token containing seller authentication data.
 *
 * @param payload - The seller data to embed in the token (id_seller, username, role_id)
 * @returns JWT token as string
 *
 * @example
 * const token = generateToken({ id_seller: 1, username: 'seller123', role_id: 2 });
 * console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const token = jwt.sign(payload, envConfig.JWT_SECRET || '', {
      expiresIn: envConfig.JWT_EXPIRES_IN,
      issuer: 'api_node_ordenes_entrega',
      audience: 'ordenes_entrega'
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
 *
 * @example
 * const payload = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * if (payload) {
 *   console.log('Seller ID:', payload.id_seller);
 * }
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET, {
      issuer: 'api_node_ordenes_entrega',
      audience: 'ordenes_entrega'
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
 *
 * @example
 * const token = extractTokenFromHeader('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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