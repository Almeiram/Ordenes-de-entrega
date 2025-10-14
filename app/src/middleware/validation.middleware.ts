// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import ProductWarehouse from '../models/productWhereHouse.model';
import Customer from '../models/customer.model';

/**
 * Middleware to ensure there is sufficient stock in the selected warehouse for a product.
 * Used before creating an Order (Requisito 3a, 6a).
 * Assumes req.body contains an array of items: [{ product_id, warehouse_id, quantity }]
 */
export const validateStockForOrder = async (req: Request, res: Response, next: NextFunction) => {
  const items = req.body.items as { product_id: number, warehouse_id: number, quantity: number }[];

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Validation error: Order must contain at least one item.' });
  }

  try {
    for (const item of items) {
      if (!item.product_id || !item.warehouse_id || item.quantity <= 0) {
          return res.status(400).json({ message: 'Validation error: All items must specify valid product_id, warehouse_id, and quantity (> 0).' });
      }

      // 1. Find the stock entry
      const stockEntry = await ProductWarehouse.findOne({
        where: {
          id_product: item.product_id, 
          id_wherehouse: item.warehouse_id, 
        },
      });

      if (!stockEntry) {
        return res.status(404).json({ message: `Validation error: Product ID ${item.product_id} not found in Warehouse ID ${item.warehouse_id}.` });
      }

      // 2. Check if stock is sufficient
      const currentStock = stockEntry.get('stock') as number;

      if (currentStock < item.quantity) {
        return res.status(400).json({ 
          message: `Validation error: Insufficient stock for Product ID ${item.product_id} in Warehouse ID ${item.warehouse_id}. Available: ${currentStock}, Requested: ${item.quantity}.` 
        });
      }
    }

    next();

  } catch (error) {
    console.error('Stock validation error:', error);
    res.status(500).json({ message: 'Internal server error during stock validation.' });
  }
};

/**
 * Middleware to prevent registering a customer with a duplicate document number (Requisito 6b).
 */
export const checkDuplicateCustomerDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { document_number } = req.body;

  if (!document_number) {
    return res.status(400).json({ message: 'Validation error: Document number is required.' });
  }

  try {
    const existingCustomer = await Customer.findOne({
      where: { document_number },
    });

    if (existingCustomer) {
      return res.status(409).json({ message: `Conflict: A customer with document number ${document_number} already exists.` });
    }

    next();
  } catch (error) {
    console.error('Customer document validation error:', error);
    res.status(500).json({ message: 'Internal server error during customer document validation.' });
  }
};
