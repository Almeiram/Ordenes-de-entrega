import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken, JWTPayload } from '../services/jwt.service'
import User  from "../Persistence/users/user.model";
import Role from "../Persistence/roles/role.model";

/**
 * Middleware generator for JWT authentication and role-based access control.t
 *
 * @param {number[]} [allowedRoles=[]] - Array of allowed role IDs.
 * If empty, any authenticated user with a valid token is allowed.
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 * Returns an Express middleware function that validates JWT and roles.
 *
 * @example
 * Protect route with authentication only
 * app.get("/profile", authMiddleware(), (req, res) => {
 *   res.json({ user: req.user })
 * })
 *
 * @example
 * Protect route with authentication + role restriction
 * app.post("/admin", authMiddleware([1]), (req, res) => {
 *   res.json({ message: "Welcome Admin" })
 * })
 */
export const authMiddleware = (allowedRoles: number[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req.headers["authorization"])
    if (!token) return res.status(401).json({ message: "No token provided" })

    const decoded = verifyToken(token)
    if (!decoded) return res.status(403).json({ message: "Invalid token" })

    req.User = decoded

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role_id)) {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  }
}