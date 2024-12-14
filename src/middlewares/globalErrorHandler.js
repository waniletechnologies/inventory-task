const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  console.log("Error", err);
  if (err.name === "ValidationError") {
    const errors = {};

    // Handle Yup validation errors
    if (err.inner) {
      err.inner.forEach((validationError) => {
        const { path, message } = validationError;
        errors[path] = message;
      });
    }

    // Getting the first key-value pair
    const firstError = Object.values(err.errors)[0];
    return res.status(422).json({ status: false, message: firstError, errors });
  }

  if (err.name === "JsonWebTokenError") {
    // Handle JWT validation errors
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    // Handle expired JWT tokens
    statusCode = 401;
    message = "Token has expired";
  }

  if (err.name === "SyntaxError" && err instanceof SyntaxError) {
    // Handle JSON parsing errors
    statusCode = 400;
    message = "Invalid JSON format";
  }

  if (err.name === "TypeError" && err instanceof TypeError) {
    // Handle TypeErrors
    statusCode = 400;
    message = "Type error occurred";
  }

  // Add more custom error handling based on your application's needs

  // Send the error response
  res.status(statusCode).json({ status: false, message: message });
};

export default globalErrorHandler;
