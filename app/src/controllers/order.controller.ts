// src/controllers/customer.controller.ts
import { Request, Response } from 'express';
import Customer from '../models/customer.model';
import { checkDuplicateCustomerDocument } from '../middlewares/validation.middleware'; 

// NOTE: checkDuplicateCustomerDocument middleware must be used in the route before createClient

/**
 * @route GET /api/v1/clients
 * @description Lists all customers (Admin/Analyst - Requisito 2a).
 */
export const listAllClients = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll({
      attributes: ['id_customer', 'fullname', 'document_number', 'email', 'address', 'is_active'], 
      order: [['fullname', 'ASC']],
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error listing clients:', error);
    res.status(500).json({ message: 'Internal server error while listing clients.' });
  }
};

/**
 * @route POST /api/v1/clients/search
 * @description Searches for a customer by document number (Admin/Analyst - Requisito 2b).
 */
export const searchClientByDocument = async (req: Request, res: Response) => {
  const { document_number } = req.body;

  if (!document_number) {
    return res.status(400).json({ message: 'Document number is required for searching.' });
  }

  try {
    const customer = await Customer.findOne({
      where: { document_number },
      attributes: ['id_customer', 'fullname', 'document_number', 'email', 'address', 'is_active'],
    });

    if (!customer) {
      return res.status(404).json({ message: `Customer with document number ${document_number} not found.` });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error searching client by document number:', error);
    res.status(500).json({ message: 'Internal server error while searching for client.' });
  }
};

/**
 * @route POST /api/v1/clients
 * @description Allows creation of a new client (Admin only - Requisito 1a: CRUD completo).
 */
export const createClient = async (req: Request, res: Response) => {
    const { fullname, document_number, email, address } = req.body;

    if (!fullname || !document_number || !email || !address) {
        return res.status(400).json({ message: 'Full name, document number, email, and address are required.' });
    }

    try {
        const newCustomer = await Customer.create({
            fullname,
            document_number,
            email,
            address,
            is_active: true, 
        });

        res.status(201).json({ 
            message: 'Customer registered successfully.', 
            customer: newCustomer 
        });

    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Internal server error while creating the client.' });
    }
}

/**
 * @route PUT /api/v1/clients/:id
 * @description Allows updating an existing client (Admin only - Requisito 1a: CRUD completo).
 */
export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fullname, email, address, is_active } = req.body;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        await customer.update({
            fullname: fullname || customer.get('fullname'),
            email: email || customer.get('email'),
            address: address || customer.get('address'),
            is_active: is_active !== undefined ? is_active : customer.get('is_active'),
        });

        res.status(200).json({ 
            message: 'Customer updated successfully.', 
            customer 
        });

    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Internal server error while updating the client.' });
    }
}

/**
 * @route DELETE /api/v1/clients/:id
 * @description Allows logical deletion (inactivation) of a client (Admin only - Requisito 1a: CRUD completo).
 */
export const deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        await customer.update({ is_active: false });

        res.status(200).json({ 
            message: `Customer ${id} inactivated successfully (logical deletion).`
        });

    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Internal server error while deleting the client.' });
    }
}

export default {
    listAllClients,
    searchClientByDocument,
    createClient,
    updateClient,
    deleteClient
};
