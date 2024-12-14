import * as yup from "yup";

export const recordSaleSchema = yup.object().shape({
  customerId: yup.number().integer().positive("Customer ID must be a positive integer").required(),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.number().integer().positive("Product ID must be a positive integer").required(),
        quantity: yup.number().integer().min(1, "Quantity must be at least 1").required(),
        pricePerUnit: yup.number().positive("Price per unit must be positive").required(),
      })
    )
    .required("Items are required")
    .min(1, "At least one item must be included"),
});
