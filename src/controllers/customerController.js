import prisma from "../configs/prismaClient.js";
import { registerCustomerSchema } from "../validation/customerSchema.js";

// Register a customer
export const registerCustomer = async (req, res) => {
  const { name, phone, email } = req.body;
  // Validate request body
  await registerCustomerSchema.validate(req.body, { abortEarly: false });
  // Create customer
  const customer = await prisma.customer.create({
    data: { name, phone, email },
  });
  res.json(customer);
};

// Retrieve all customers
export const getCustomers = async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
};

// Retrieve customer purchase history
export const getCustomerPurchaseHistory = async (req, res) => {
  const { id } = req.params;

  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(id) },
    include: { sales: { include: { items: true } } },
  });
  res.json(customer);
};
