const User = require("./users.model");
const bcrypt = require("bcrypt");
const JwtUtils = require("../../utils/jwt/jwt");
const { setError } = require("../../utils/errors/error");

const register = async (req, res, next) => {
  try {
    const user = new User(req.body);

    const userExist = await User.findOne({ email: user.email });
    if (userExist) {
      return next(setError("404", "This email has already been used."));
    }
    const userDB = await user.save();
    return res.status(201).json({
      status: 201,
      message: `User ${userDB.email} created`,
    });
  } catch (error) {
    return next(setError(error.statusCode, "User Not Created"));
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(setError("User Not Found"));
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = JwtUtils.generateToken(user._id, user.email);

      return res.status(200).json(token);
    }
  } catch (error) {
    return next(setError(error.statusCode, "User Not Found"));
  }
};

const logout = (req, res, next) => {
  try {
    const token = null;
    return res.status(200).json({
      status: 200,
      message: "Logout successful",
    });
  } catch (error) {
    return next(setError(error.statusCode, "Logout Error"));
  }
};

module.exports = { register, login, logout };
