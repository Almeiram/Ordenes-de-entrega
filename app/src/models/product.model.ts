// src/Persistence/products/product.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
  id_product: number;
  code: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id_product!: number;
  public code!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public is_active!: boolean;
}

Product.init(
  {
    id_product: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Logical deletion (Requisito 4b)
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);

export default Product;
