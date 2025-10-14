// DTO de Entrada: Lo que se espera del cliente al crear un nuevo rol
export interface CreateRoleDTO {
    name: string;
    is_active?: boolean; 
}

export interface RoleUpdateDTO {
    name?: string;
}

// DTO de Salida: Lo que se le devuelve al cliente después de una operación (respuesta limpia)
export interface RoleResponseDTO {
    id: number;
    name: string;
    isActive: boolean; 
}

/**
 * Función de mapeo para transformar un objeto Sequelize/Modelo a nuestro DTO de Salida.
 * Esto asegura que solo enviamos los campos que queremos.
 */
export const toRoleResponseDTO = (role: { id_role: number, name: string, is_active: boolean }): RoleResponseDTO => {
    return {
        id: role.id_role,
        name: role.name,
        isActive: role.is_active,
    };
};