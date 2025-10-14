// src/Persistence/users/user.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id_user: number;
  fullname: string;
  document_number: string;
  access_id: number;
  role_id: number; // Added role_id for easier role query
  is_active: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id_user!: number;
  public fullname!: string;
  public document_number!: string;
  public access_id!: number;
  public role_id!: number;
  public is_active!: boolean;
}

User.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    document_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // Requisito: documento único
    },
    access_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'accesses',
            key: 'id_access',
        },
    },
    role_id: { // Added role_id for easier role access via token and middleware
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id_role',
        },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

export default User;
