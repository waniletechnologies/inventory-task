import prisma from "../configs/prismaClient.js";
import { recordSaleSchema } from "../validation/saleSchema.js";

// Record a sale (POST /sales)
export const recordSale = async (req, res) => {
  const { customerId, items } = req.body;
  // Validate request body
  await recordSaleSchema.validate(req.body, { abortEarly: false });
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );

  // Create the sale record
  const sale = await prisma.sale.create({
    data: {
      customerId,
      totalAmount,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
        })),
      },
    },
    include: { items: true }, // Include the related items in the response
  });

  // Update stock for each product
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  res.status(201).json(sale);
};

// Retrieve sales records with optional date filters (GET /sales)
export const getSales = async (req, res) => {
  const { startDate, endDate } = req.query;

  const whereClause = {};
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = new Date(startDate);
    if (endDate) whereClause.date.lte = new Date(endDate);
  }

  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: { items: { include: { product: true } }, customer: true },
  });

  res.json(sales);
};

// Retrieve details of a specific sale (GET /sales/{id})
export const getSaleById = async (req, res) => {
  const { id } = req.params;

  const sale = await prisma.sale.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: { include: { product: true } },
      customer: true,
    },
  });

  if (!sale) {
    return res.status(404).json({ error: "Sale not found" });
  }

  res.json(sale);
};
