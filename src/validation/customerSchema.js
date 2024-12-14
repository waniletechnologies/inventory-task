import * as yup from "yup";

export const registerCustomerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be a valid 10-digit number")
    .required("Phone is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
});
