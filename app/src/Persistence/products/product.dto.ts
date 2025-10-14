// Input of DTO related to products
export interface CreateProductDTO {
    name: string;
    stock: number;
    is_active?: boolean; 
}

export interface ProductUpdateDTO {
    name?: string;
    stock?: number;
}

// Output of DTO related to products
export interface ProductResponseDTO {
    id_product: number;
    name: string;
    stock: number;
    is_active: boolean;
}   

// Mapping function to transform a Sequelize/Model object to our Output DTO.

export const toProductResponseDTO = (product: { id_product: number, name: string, stock: number, is_active: boolean }): ProductResponseDTO => {
    return {
        id_product: product.id_product,
        name: product.name,
        stock: product.stock,
        is_active: product.is_active,
    };
}