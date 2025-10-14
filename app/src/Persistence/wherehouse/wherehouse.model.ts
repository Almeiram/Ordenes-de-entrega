import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface warehouseAttributes {
    id_warehouse: number;
    name: string;
    capacity: number;
    is_active: boolean;
}

class warehouse extends Model<warehouseAttributes> implements warehouseAttributes {
    public id_warehouse!: number;
    public name!: string;
    public capacity!: number;
    public is_active!: boolean;
}

warehouse.init(
    {
        id_warehouse: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'Warehouse',
        tableName: 'warehouses',
        timestamps: false
    }
)

export default warehouse;