import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface RoleAttributes {
  id_role: number;
  name: string;
  is_active: boolean;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id_role'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id_role!: number;
  public name!: string;
  public is_active!: boolean;
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
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
