
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

export interface OrderItemAttributes {
    id_order_item: number;
    order_id: number;
    product_id:number;
    amount: number;
    price: number;
    subtotal: number;
    is_active: boolean;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id_order_item"> { }


class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id_order_item!: number;
    public order_id!: number;
    public product_id!: number;
    public amount!: number;
    public price!: number;
    public subtotal!: number;
    public is_active!: boolean;
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
                model: "order",
                key: "id_order",
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "product",
                key: "id_product",
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
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
        modelName: "OrderItem",      // Name of the model in Sequelize
        tableName: "order_item",    // Name of the table in the database (singular)
        timestamps: true,       // includes createdAt and updatedAt
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default OrderItem;