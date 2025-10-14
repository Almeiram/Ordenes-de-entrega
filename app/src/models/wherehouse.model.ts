// src/Persistence/wherehouse/wherehouse.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface WarehouseAttributes {
  id_warehouse: number;
  name: string;
  location: string;
  is_active: boolean;
}

class Warehouse extends Model<WarehouseAttributes> implements WarehouseAttributes {
  public id_warehouse!: number;
  public name!: string;
  public location!: string;
  public is_active!: boolean;
}

Warehouse.init(
  {
    id_warehouse: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Bodegas start active by default
    },
  },
  {
    sequelize,
    modelName: "Warehouse",
    tableName: "warehouses",
    timestamps: false,
  }
);

export default Warehouse;
