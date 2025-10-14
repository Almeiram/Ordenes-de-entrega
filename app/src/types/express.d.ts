import { Request } from "express";
import { JWTPayload } from "../services/jwt.service";

/**
 * Extension of the `Express.Request` type
 * ---------------------------------------
 * 
 * This file extends Express' `Request` interface to include 
 * extra properties used by authentication and authorization 
 * middlewares.
 * 
 * - `user`: Holds the decoded JWT payload 
 *   (e.g., user id, email, issued/expiration times, etc.).
 *   It is attached when the authentication middleware successfully 
 *   validates the token.
 * 
 * - `role`: Holds the resolved role object of the user 
 *   (e.g., id, name, and active status).
 *   It is attached by the authorization/role resolution middleware 
 *   and can be used for RBAC (Role-Based Access Control).
 * 
 * This ensures that when you access `req.user` or `req.role` in your 
 * controllers and services, TypeScript will recognize those properties 
 * as valid and strongly typed.
 */

declare global {
  namespace Express {
    interface Request {
      /** 
       * JWT payload data attached by the authentication middleware.
       */
      user?: JWTPayload;

      /** 
       * Optional role object resolved by the authorization middleware.
       * Represents the current user's role.
       */
      role?: { id_role: number; name: string; is_active: boolean };
    }
  }
}