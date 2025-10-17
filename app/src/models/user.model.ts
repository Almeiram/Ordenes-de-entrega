import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id_user: number;
  fullname: string;
  document_number: string;
  access_id: number;
  is_active: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id_user!: number;
  public fullname!: string;
  public document_number!: string;
  public access_id!: number;
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
      unique: true,
    },
    document_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    access_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
            references: {
                model: 'accesses',
                key: 'id_access',
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