import Product, { ProductAttributes } from "./product.model";
import { CreateProductDTO, ProductResponseDTO, ProductUpdateDTO, toProductResponseDTO } from "./product.dto";

export class ProductDAO {
    // Get all products
    public static async getAllProducts(): Promise<ProductResponseDTO[]> {
        const products = await Product.findAll({
            attributes: ["id_product", "name", "stock", "is_active"],
        });
        return products.map((product) => toProductResponseDTO(product.get()));
    }

    // Get product by id
    public static async getProductById(id_product: number): Promise<ProductResponseDTO | null> {
        const product = await Product.findByPk(id_product);
        if (!product) {
            return null;
        }
        return toProductResponseDTO(product.get());
    }
    // Create new product
    public static async createProduct(productData: CreateProductDTO): Promise<ProductResponseDTO> {
        const newProduct = await Product.create(productData as ProductAttributes);
        return toProductResponseDTO(newProduct.get());
    }
    // Update product  
    public static async updateProduct(id_product: number, updateData: ProductUpdateDTO): Promise<ProductResponseDTO | null> {
        const [rowsAffected, [updatedProduct]] = await Product.update(updateData, {
            where: { id_product },
            returning: true,
        });
        if (rowsAffected === 0) {
            return null;
        }
        return toProductResponseDTO(updatedProduct.get());
    }
    // Delete product
    public static async softDeleteProduct(id_product: number): Promise<boolean> {
        const rowsDeleted = await Product.destroy({
            where: { id_product }
        });
        return rowsDeleted > 0;
    }
}

export default ProductDAO;