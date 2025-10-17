import Role from "../models/role.model";
import Access from "../models/access.model";

export const applyAssociations = () => {
  // Roles y Accesos
  // Un rol puede tener muchos accesos, pero un acceso solo puede tener un rol
  Access.belongsTo(Role, { foreignKey: "role_id", as: "role" });
  Role.hasMany(Access, { foreignKey: "role_id", as: "users" });

};