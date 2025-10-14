// Entry DTO: What is expected from the client when creating a new role
export interface CreateAccessDTO {
    username: string;
    password: string;
    role_id: number;
    is_active?: boolean; 
}

export interface AccessUpdateDTO {
    username?: string;
    password?: string;
    role_id?: number;
}

// Output DTO: What is returned to the client after an operation (clean response)
export interface AccessResponseDTO {
    id: number;
    username: string;
    roleId: number;
    isActive: boolean;
}

/**
* Mapping function to transform a Sequelize/Model object into our Output DTO.
* This ensures that we only send the fields we want.
*/
export const toAccessResponseDTO = (role: { id_access: number, username: string, role_id: number, is_active: boolean }): AccessResponseDTO => {
    return {
        id: role.id_access,
        username: role.username,
        roleId: role.role_id,
        isActive: role.is_active,
    };
};