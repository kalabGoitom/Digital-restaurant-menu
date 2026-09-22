const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => err.message);

      const error = errorMessages.join(", ");

      return res.status(400).json({
        message: error,
      });
    }

    next();
  };
};

export default validateQuery;
