
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

/**
 * Main attributes of the `customer` entity.
 */
export interface CustomerAttributes {
  id_customer: number;
  address_id: number;
  gender_id: number;
  fullname: string;
  phone?: string | null;
  email: string;
  is_active: boolean;
}

export interface CustomerCreationAttributes extends Optional<CustomerAttributes, "id_customer" > {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id_customer!: number;
  public address_id!: number;
  public gender_id!: number;
  public fullname!: string;
  public phone!: string | null;
  public email!: string;
  public is_active!: boolean;
}

Customer.init(
  {
    id_customer: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "address",
        key: "id_address",
      },
    },
    gender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gender",
        key: "id_gender",
      },
    },
    fullname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: "Customer",      // Model name in Sequelize
    tableName: "customer",    // Name of the table in the database (singular)
    timestamps: true,      // includes createdAt and updatedAt
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Customer;