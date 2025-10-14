import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface AccessAttributes {
  id_access: number;
  username: string;
  password: string;
  role_id: number;
  is_active: boolean;
}

class Access extends Model<AccessAttributes> implements AccessAttributes {
  public id_access!: number;
  public username!: string;
  public password!: string;
  public role_id!: number;
  public is_active!: boolean;
}

Access.init(
  {
    id_access: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
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
    modelName: "Access",
    tableName: "accesses",
    timestamps: false,
  }
);

export default Access;