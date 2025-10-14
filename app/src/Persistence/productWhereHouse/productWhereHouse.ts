import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface ProductWarehouseAttributes {
  id_product_warehouse: number;
  warehouse_id: number;
  product_id: number;
  amount: number;
  is_active: boolean;
}

class ProductWarehouse
  extends Model<ProductWarehouseAttributes>
  implements ProductWarehouseAttributes
{
  public id_product_warehouse!: number;
  public warehouse_id!: number;
  public product_id!: number;
  public amount!: number;
  public is_active!: boolean;
}

ProductWarehouse.init(
  {
    id_product_warehouse: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "warehouses",
        key: "id_warehouse",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos",
        key: "id_producto",
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
    modelName: "Product_Warehouse",
    tableName: "products_warehouses",
    timestamps: false,
  }
);

export default ProductWarehouse;