import Role from "./role.model";
import { CreateRoleDTO, RoleResponseDTO, RoleUpdateDTO, toRoleResponseDTO } from "./role.dto";
import { RoleAttributes } from "./role.model";

class RoleDAO {
  // Get all roles
  public static async getAllRoles(): Promise<RoleResponseDTO[]> {
    const roles = await Role.findAll({
      attributes: ["id_role", "name", "is_active"],
    });

    return roles.map((role) => toRoleResponseDTO(role.get()));
}

  // Get by id
  public static async getRoleById(id_role: number): Promise<RoleResponseDTO | null> {
    const role = await Role.findByPk(id_role);

    if (!role) {
        return null;
    }

    return toRoleResponseDTO(role.get())
  }

  // Create new role
  public static async createRole(roleData: CreateRoleDTO): Promise<RoleResponseDTO> {
    const newRole = await Role.create(roleData as RoleAttributes);

    return toRoleResponseDTO(newRole.get())
  }

  // Update role
  public static async updateRole (id_role: number, updateData: RoleUpdateDTO): Promise<RoleResponseDTO | null> {
    const [rowAffected, [updateRole]] = await Role.update(updateData, {
        where: { id_role },
        returning: true
    });
    if (rowAffected === 0) {
        return null;
    }
    return toRoleResponseDTO(updateRole.get())
  }

  // SoftDelete
  public static async deleteRole (id_role: number): Promise<boolean> {
    const [rowsAffected] = await Role.update({ is_active: false }, {
        where: { id_role, is_active: true }
    });

    return rowsAffected > 0;
  }

}

export default RoleDAO;