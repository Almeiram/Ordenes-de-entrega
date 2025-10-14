import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface ProductAttributes {
    id_product: number;
    name: string;
    stock: number;
    is_active: boolean;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id_product!: number;
    public name!: string;
    public stock!: number;
    public is_active!: boolean;
}

Product.init(
    {
        id_product: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        stock: {
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
        modelName: 'Product',
        tableName: 'products',
        timestamps: false
    }
)

export default Product;