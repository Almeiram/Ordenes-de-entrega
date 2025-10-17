import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CustomerAttributes {
  id_customer: number;
  fullname: string;
  document_number: string;
  email: string;
  address: string;
  is_active: boolean;
}
export interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id_customer'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id_customer!: number;
  public fullname!: string;
  public document_number!: string;
  public email!: string;
  public address!: string;
  public is_active!: boolean;
}

Customer.init(
  {
    id_customer: {
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
      unique: true, 
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: { // Delivery address added based on requirement
        type: DataTypes.STRING(255),
        allowNull: true, 
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Customer",
    tableName: "customers",
    timestamps: false,
  }
);

export default Customer;
