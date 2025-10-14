// src/Persistence/orderItems/orderItem.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface OrderItemAttributes {
  id_order_item: number;
  order_id: number;
  product_id: number;
  warehouse_id: number; // Bodega de despacho (Requisito 5a)
  quantity: number;
  unit_price: number;
}

class OrderItem extends Model<OrderItemAttributes> implements OrderItemAttributes {
  public id_order_item!: number;
  public order_id!: number;
  public product_id!: number;
  public warehouse_id!: number;
  public quantity!: number;
  public unit_price!: number;
}

OrderItem.init(
  {
    id_order_item: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id_order',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product',
      },
    },
    warehouse_id: { // Warehouse from which the product was dispatched
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'warehouses',
            key: 'id_warehouse',
        },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: false,
  }
);

export default OrderItem;
