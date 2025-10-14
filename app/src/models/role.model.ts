// src/Persistence/roles/role.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface RoleAttributes {
  id_role: number;
  name: string; // 'administrador' or 'analista'
  description: string;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id_role!: number;
  public name!: string;
  public description!: string;
}

Role.init(
  {
    id_role: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: false,
  }
);

export default Role;
