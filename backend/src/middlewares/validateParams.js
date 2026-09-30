const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => err.message);

      return res.status(400).json({
        message: errorMessages.join(", "),
      });
    }

    req.params = result.data;

    next();
  };
};

export default validateParams;
