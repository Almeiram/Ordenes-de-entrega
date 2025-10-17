// src/controllers/role.controller.ts
import { Request, Response } from "express";
import Role from "../models/role.model";

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const defaultRoles = ["admin", "user"];

    for (const roleName of defaultRoles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName, is_active: true },
      });
    }
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error to get roles:", error);
    res.status(500).json({ message: "Error to get roles" });
  }
};
