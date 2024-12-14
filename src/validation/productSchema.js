import * as yup from "yup";

export const addProductSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  price: yup.number().positive("Price must be a positive number").required("Price is required"),
  stock: yup.number().integer("Stock must be an integer").min(0, "Stock cannot be negative"),
});
