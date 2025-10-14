
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

export interface OrderAttributes {
  id_order: number;
  customer_id: number;
  seller_id: number;
  payment_method_id: number;
  order_status_id: number;
  payment_date: Date;
  total: number;
  is_active: boolean;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, "id_order" > {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id_order!: number;
  public customer_id!: number;
  public seller_id!: number;
  public payment_method_id!: number;
  public order_status_id!: number;
  public payment_date!: Date;
  public total!: number; 
  public is_active!: boolean;

}

Order.init(
  {
    id_order: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customer",
        key: "id_customer",
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "seller",
        key: "id_seller",
      }
    },
      payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "payment_method",
        key: "id_payment_method",
        }
    },
     order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order_status",
        key: "id_order_status",
        }
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
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
    modelName: "Order",      // Model name in Sequelize
    tableName: "order",    // Name of the table in the database (singular)
    timestamps: true,      // includes createdAt and updatedAt
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Order;