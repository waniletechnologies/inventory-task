import prisma from "../configs/prismaClient.js";
import { addProductSchema } from "../validation/productSchema.js";

// Add a new product
export const addProduct = async (req, res) => {
  const { name, category, price, stock } = req.body;
// Validate request body
await addProductSchema.validate(req.body, { abortEarly: false });
  const product = await prisma.product.create({
    data: { name, category, price, stock },
  });
  res.json(product);
};

// Retrieve all products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a specific product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(product);
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, category, price, stock },
  });
  res.json(product);
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Product deleted successfully" });
};
