const signup = async (req, res) => {
  const { name, email, role = "Admin", password } = req.body;
  res.status(200).json({
    name,
    email,
    role,
    password,
  });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;
  res.status(200).json({
    name,
    email,
    password,
  });
};

const getUser = async (req, res) => {};

export { signup, login, getUser };
