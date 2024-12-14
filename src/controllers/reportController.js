import prisma from "../configs/prismaClient.js";

// Generate sales report
export const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  const whereClause = {};
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = new Date(startDate);
    if (endDate) whereClause.date.lte = new Date(endDate);
  }

  // Fetch sales data
  const sales = await prisma.sale.findMany({
    where: whereClause,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
    },
  });

  // Initialize aggregations
  let totalSales = 0;
  let totalRevenue = 0;
  let categorySales = {};
  let salesTrends = {};
  let customerMetrics = {};
  let productSales = {};

  sales.forEach((sale) => {
    totalSales++;
    totalRevenue += sale.totalAmount;

    // Sales by customer
    if (sale.customer) {
      const customerId = sale.customer.id;
      if (!customerMetrics[customerId]) {
        customerMetrics[customerId] = {
          customerName: sale.customer.name,
          totalSpent: 0,
          salesCount: 0,
        };
      }
      customerMetrics[customerId].totalSpent += sale.totalAmount;
      customerMetrics[customerId].salesCount++;
    }

    // Sales trends (by month)
    const saleMonth = new Date(sale.date).toISOString().slice(0, 7);
    if (!salesTrends[saleMonth]) {
      salesTrends[saleMonth] = {
        totalRevenue: 0,
        salesCount: 0,
      };
    }
    salesTrends[saleMonth].totalRevenue += sale.totalAmount;
    salesTrends[saleMonth].salesCount++;

    // Product and category sales
    sale.items.forEach((item) => {
      // Product sales aggregation
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productName: item.product.name,
          quantitySold: 0,
          revenueGenerated: 0,
        };
      }
      productSales[item.productId].quantitySold += item.quantity;
      productSales[item.productId].revenueGenerated +=
        item.quantity * item.pricePerUnit;

      // Category sales aggregation
      if (!categorySales[item.product.category]) {
        categorySales[item.product.category] = {
          revenueGenerated: 0,
          quantitySold: 0,
        };
      }
      categorySales[item.product.category].revenueGenerated +=
        item.quantity * item.pricePerUnit;
      categorySales[item.product.category].quantitySold += item.quantity;
    });
  });

  // Convert data to arrays for better reporting
  const topCustomers = Object.values(customerMetrics)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5); // Top 5 customers
  const topSellingProducts = Object.values(productSales).sort(
    (a, b) => b.quantitySold - a.quantitySold
  );
  const categoryWiseSales = Object.entries(categorySales).map(
    ([category, data]) => ({
      category,
      ...data,
    })
  );
  const salesTrendArray = Object.entries(salesTrends).map(([month, data]) => ({
    month,
    ...data,
  }));

  // Final report
  const report = {
    totalSales,
    totalRevenue,
    averageSaleValue: totalRevenue / totalSales || 0,
    topCustomers,
    topSellingProducts,
    categoryWiseSales,
    salesTrends: salesTrendArray,
  };

  res.json(report);
};

// Generate inventory report
export const getInventoryReport = async (req, res) => {
  // Fetch all products
  const products = await prisma.product.findMany();

  // Classify products based on stock levels
  const lowStockThreshold = 5;
  const sufficientStockThreshold = 20;

  const lowStockProducts = products.filter(
    (product) => product.stock < lowStockThreshold
  );
  const sufficientStockProducts = products.filter(
    (product) =>
      product.stock >= lowStockThreshold &&
      product.stock <= sufficientStockThreshold
  );
  const highStockProducts = products.filter(
    (product) => product.stock > sufficientStockThreshold
  );

  // Aggregate report
  const report = {
    totalProducts: products.length,
    lowStockCount: lowStockProducts.length,
    sufficientStockCount: sufficientStockProducts.length,
    highStockCount: highStockProducts.length,
    lowStockProducts,
    sufficientStockProducts,
    highStockProducts,
  };

  res.json(report);
};
