const { decodeToken } = require("../../services/auth");
const { getUserById } = require("../../services/users");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const data = decodeToken(token);
    const user = await getUserById(data.id);

    req.user = user;
    next();
  } catch (errors) {
    return res.status(500).send("server errors");
  }
};

const checkRole = (role) => (req, res, next) => {
  const user = req.user;

  if (user.role !== role) {
    return res.status(401).send("Can't access");
  }
  next();
};

module.exports = {
  authenticate,
  checkRole,
};
