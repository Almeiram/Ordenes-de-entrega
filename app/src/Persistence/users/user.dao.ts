import User from "./user.model";
import { CreateUserDTO, UserUpdateDTO, UserResponseDTO,toUserResponseDTO } from "./user.dto";
import { UserAttributes } from "./user.model";
import { CreateAccessDTO } from "../accesses/access.dto";
import AccessDAO from "../accesses/access.dao";

export interface CreateUserWithAccessDTO {
    access: CreateAccessDTO;
    user: Omit<CreateUserDTO, "access_id">;
}
class UserDAO {
    // Get all users
    public static async getAllUsers(): Promise<UserResponseDTO[]> {
        const users = await User.findAll({
            attributes: ['id_user', 'fullname', 'document_number', 'access_id', 'is_active']
        });
        return users.map((user) => toUserResponseDTO(user.get()));
    }
    // Get user by id
    public static async getUserById(id_user: number): Promise<UserResponseDTO | null> {
        const user = await User.findByPk(id_user);
        if (!user){
            return null;
        }
        return toUserResponseDTO(user.get());
    }

    public static async createUserWithAccess(data: CreateUserWithAccessDTO): Promise<UserResponseDTO> {
        // 1️⃣ Crear el acceso
        const newAccess = await AccessDAO.createAccess(data.access);

        // 2️⃣ Crear el usuario, asignándole el id del acceso
        const newUser = await User.create({
            ...data.user,
            access_id: newAccess.id,
        } as UserAttributes);

        // 3️⃣ Retornar el usuario formateado con el DTO
        return toUserResponseDTO(newUser.get());
    }

    // Create a new user
    public static async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
        const newUser = await User.create(userData as UserAttributes);
        return toUserResponseDTO(newUser.get());
    }

    // Update a user
    public static async updateUser(id_user: number, userData: UserUpdateDTO): Promise<UserResponseDTO | null> {
        const [rowsAffected, [updatedUser]] = await User.update(userData, {
            where: { id_user },
            returning: true,
        });
        if (rowsAffected === 0) {
            return null;
        }
        return toUserResponseDTO(updatedUser.get());
    }

    // Soft delete a user
    public static async deleteUser(id_user: number): Promise<boolean> {
        const [rowsAffected] = await User.update({ is_active: false }, {
            where: { id_user, is_active: true }
        });
        return rowsAffected > 0;
    }
}


export default UserDAO;