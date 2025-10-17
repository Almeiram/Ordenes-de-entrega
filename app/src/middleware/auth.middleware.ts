import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken} from '../services/jwt.service'

// Middleware to authenticate and authorize users based on roles
export const authMiddleware = (allowedRoles: number[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req.headers["authorization"])
    if (!token) return res.status(401).json({ message: "No token provided" })

    const decoded = verifyToken(token)
    if (!decoded) return res.status(403).json({ message: "Invalid token" })

    req.user = decoded

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role_id)) {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  }
};