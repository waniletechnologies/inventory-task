import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import { getSaleById, getSales, recordSale } from "../controllers/saleController.js";
import { getCustomerPurchaseHistory, getCustomers, registerCustomer } from "../controllers/customerController.js";
import { getInventoryReport, getSalesReport } from "../controllers/reportController.js";
const router = express.Router();




// Product routes
router.post("/products", addProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Sale routes
router.post("/sales", recordSale);
router.get("/sales", getSales);
router.get("/sales/:id", getSaleById);

// Customer routes
router.post("/customers", registerCustomer);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerPurchaseHistory);

// Report routes
router.get("/reports/sales", getSalesReport);
router.get("/reports/inventory",getInventoryReport);




export default router;
