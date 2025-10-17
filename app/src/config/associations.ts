import Role from "../models/role.model";
import Access from "../models/access.model";
import User from "../models/user.model";

export const applyAssociations = () => {
  // Roles y Accesos
  // Un rol puede tener muchos accesos, pero un acceso solo puede tener un rol
  Role.hasMany(Access, {
    foreignKey: "role_id",
    as: "accesses",
  });
  Access.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
  });

  // Users y Accesos
  // Un usuario puede tener un acceso y viceversa
  Access.hasOne(User, {
    foreignKey: "access_id",
    as: "user",
  });
  User.belongsTo(Access, {
    foreignKey: "access_id",
    as: "access",
  });

  // // Bodega y Productos_bodega
  // // Una bodega puede tener muchos productos_bodega y un productos_bodega solo puede tener una bodega
  // Warehouse.belongsToMany(Product, {
  //   through: ProductWarehouse,
  //   foreignKey: "warehouse_id", // Clave foránea en ProductBodega que apunta a Bodega
  //   otherKey: "product_id", // Clave foránea en ProductBodega que apunta a Product
  //   as: "products", // Alias para la consulta desde Bodega
  // });

  // // Producto y Productos_bodega
  // // Un producto puede tener muchos productos_bodega y un productos_bodega solo puede tener un producto
  // Product.belongsToMany(Warehouse, {
  //   through: ProductWarehouse,
  //   foreignKey: "product_id", // Clave foránea en ProductBodega que apunta a Product
  //   otherKey: "warehouse_id", // Clave foránea en ProductBodega que apunta a Bodega
  //   as: "warehouses", // Alias para la consulta desde Product
  // });
};