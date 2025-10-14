// src/config/associations.ts

// Import all models
import Access from "../models/access.model";
import Role from "../models/role.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import ProductWarehouse from "../models/productWhereHouse.model";
import Warehouse from "../models/wherehouse.model";
import Customer from "../models/customer.model";
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";

export const applyAssociations = () => {

  // --- 1. User/Authentication/Role Associations ---
  
  // 1a. User N:1 Role (User belongs to one Role)
  Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users",
  });
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role", // Used in auth middleware
  });

  // 1b. User 1:1 Access (User has one Access entry)
  Access.hasOne(User, {
    foreignKey: "access_id",
    as: "user_info", // Relationship from Access to User
  });
  User.belongsTo(Access, {
    foreignKey: "access_id",
    as: "access_credentials", // Relationship from User to Access (for login)
  });


  // --- 2. Inventory (Product/Warehouse) Associations ---

  // 2a. Warehouse N:M Product (via ProductWarehouse)
  Warehouse.belongsToMany(Product, {
    through: ProductWarehouse,
    foreignKey: "warehouse_id",
    otherKey: "product_id",
    as: "products_in_stock",
  });
  Product.belongsToMany(Warehouse, {
    through: ProductWarehouse,
    foreignKey: "product_id",
    otherKey: "warehouse_id",
    as: "available_warehouses",
  });
  
  // 2b. Direct associations for the intermediate table (for stock updates)
  ProductWarehouse.belongsTo(Product, { foreignKey: 'product_id', as: 'product_data' });
  ProductWarehouse.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse_data' });


  // --- 3. Order Associations ---

  // 3a. Customer 1:N Order (One customer has many orders)
  Customer.hasMany(Order, { 
    foreignKey: "customer_id", 
    as: "orders",
  });
  Order.belongsTo(Customer, {
    foreignKey: "customer_id", 
    as: "customer_data",
  });

  // 3b. Order 1:N OrderItem (One order has many items)
  Order.hasMany(OrderItem, {
    foreignKey: 'order_id', 
    as: 'items',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order_data',
  });

  // 3c. Product 1:N OrderItem (One product is in many order items)
  Product.hasMany(OrderItem, {
    foreignKey: 'product_id', 
    as: 'order_entries',
  });
  OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product_ordered',
  });

  // 3d. OrderItem N:1 Warehouse (The item was dispatched from one specific warehouse)
  OrderItem.belongsTo(Warehouse, {
    foreignKey: 'warehouse_id',
    as: 'dispatch_warehouse',
  });
  Warehouse.hasMany(OrderItem, {
    foreignKey: 'warehouse_id',
    as: 'dispatched_items',
  });

};
