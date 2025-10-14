// src/Persistence/accesses/access.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface AccessAttributes {
  id_access: number;
  // NOTE: In a real system, 'username' and 'password_hash' would be here.
  // For simplicity, we link directly to the User model, but keep this table for the 1:1 relationship with User.
  password_hash: string;
}

class Access extends Model<AccessAttributes> implements AccessAttributes {
  public id_access!: number;
  public password_hash!: string;
}

Access.init(
  {
    id_access: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // The role_id is implicitly added through the association (Access N:1 Role)
  },
  {
    sequelize,
    modelName: "Access",
    tableName: "accesses",
    timestamps: false,
  }
);

export default Access;
