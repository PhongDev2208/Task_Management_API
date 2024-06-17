const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      token: token,
    }).select("-password -token -deleted -deletedAt -createdAt -updatedAt -__v");

    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.json({
        code: 400,
        message: "Token is invalid",
      });
    }
  } else {
    res.json({
      code: 400,
      message: "Please send to the token",
    })
  }
};
