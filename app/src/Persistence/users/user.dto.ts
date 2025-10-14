export interface CreateUserDTO {
    fullname: string;
    document_number: string;
    access_id: number;
    is_active?: boolean;
}

export interface UserUpdateDTO {
    fullname?: string;
    document_number?: string;
    access_id?: number;
    is_active?: boolean;
}

// Output of DTOs related to users
export interface UserResponseDTO {
    id_user: number;
    fullname: string;
    document_number: string;
    access_id: number;
    isActive: boolean;
}

// Mapping function for User model to UserResponseDTO
export const toUserResponseDTO = (user: {
    id_user: number,
    fullname: string,
    document_number: string,
    access_id: number,
    is_active: boolean

}): UserResponseDTO => {
    return {
        id_user: user.id_user,
        fullname: user.fullname,
        document_number: user.document_number,
        access_id: user.access_id,
        isActive: user.is_active
    };
}