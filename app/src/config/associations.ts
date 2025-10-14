import Access from "../Persistence/accesses/access.model";
import Role from "../Persistence/roles/role.model";
import User from "../Persistence/users/user.model";
import Product from "../Persistence/products/product.model";
import ProductWarehouse from "../Persistence/productWhereHouse/productWhereHouse";
import warehouse from "../Persistence/wherehouse/wherehouse.model";
import Customer from "../Persistence/customers/customer.model";
import Order from "../Persistence/orders/order.model";
import OrderItem from "../Persistence/orderItems/orderItem.model";

export const applyAssociations = () => {

  // Role and access (Role 1:N Access)
  Role.hasMany(User, {
    foreignKey: "role_id",
    as: "user",
  });
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
  });

  // Users y Accesos (Access 1:1 User)
  Access.hasOne(User, {
    foreignKey: "access_id",
    as: "user",
  });
  User.belongsTo(Access, {
    foreignKey: "access_id",
    as: "access",
  });

  // warehouse and Products_warehouse (N:M a través de ProductWarehouse)
  warehouse.belongsToMany(Product, {
    through: ProductWarehouse,
    foreignKey: "warehouse_id", // Foreign key in ProductWarehouse that points to warehouse
    otherKey: "product_id", //Foreign key in ProductWarehouse pointing to Product
    as: "products", // Alias ​​for the query from the Winery
  });

  // Product and Products_warehouse (N:M a través de ProductWarehouse)
  Product.belongsToMany(warehouse, {
    through: ProductWarehouse,
    foreignKey: "product_id", // Foreign key in ProductWarehouse pointing to Product
    otherKey: "warehouse_id", // Foreign key in ProductWarehouse that points to warehouse
    as: "warehouses", // Alias ​​for query from Product
  });
  
  // Asociaciones inversas para ProductWarehouse (Tabla intermedia)
  ProductWarehouse.belongsTo(Product, { foreignKey: 'product_id', as: 'productInfo' });
  ProductWarehouse.belongsTo(warehouse, { foreignKey: 'warehouse_id', as: 'warehouseInfo' });

  // Customer y Order (La relación original 1:1 es corregida a 1:N, asumiendo un customer tiene muchas orders)
  Customer.hasMany(Order, { // Corregido de hasOne a hasMany
    foreignKey: "customer_id", // Se asume que Order tiene una columna 'customer_id'
    as: "orders",
  });
  Order.belongsTo(Customer, {
    foreignKey: "customer_id", // Se asume que Order tiene una columna 'customer_id'
    as: "customer",
  });

  // Order and OrderItem (1:N, One Order has many items/products)
  Order.hasMany(OrderItem, {
    foreignKey: 'order_id', // FK on OrderItem pointing to Order
    as: 'items',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order',
  });

  // Product and OrderItem (1:N, One Product is in many order items)
  Product.hasMany(OrderItem, {
    foreignKey: 'product_id', // FK on OrderItem pointing to Product
    as: 'orderItems',
  });
  OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
  });
};