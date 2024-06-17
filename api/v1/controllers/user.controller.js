const generateHelper = require("../../../helpers/generate.helper");
const sendMailHelper = require("../../../helpers/send-mail.helper");
const md5 = require("md5");

const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const emailExits = await User.findOne({
      email: req.body.email,
    });

    if (emailExits) {
      res.json({
        code: 400,
        message: "Email already exists",
      });
      return;
    }

    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(32);

    const user = new User(req.body);
    const data = await user.save();

    res.json({
      code: 200,
      message: "Register successfully",
      token: data.token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email does not exist",
      });
      return;
    }

    if (user.password != md5(req.body.password)) {
      res.json({
        code: 400,
        message: "Password is incorrect",
      });
      return;
    }

    res.json({
      code: 200,
      message: "Login successfully",
      token: user.token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const emailExits = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (!emailExits) {
      res.json({
        code: 400,
        message: "Email does not exist",
      });
      return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    // Step 1: Save OTP to database
    const objectForgotPassword = {
      email: req.body.email,
      otp: otp,
      expireAt: Date.now() + 5 * 60 * 1000,
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Step 2: Send OTP to email user
    const subject = "Mã OTP lấy lại mật khẩu";
    const content = `<h1>Mã OTP của bạn là: ${otp}</h1>. Vui lòng không để lộ mã OTP này cho người khác`;
    sendMailHelper.sendMail(req.body.email, subject, content);

    res.json({
      code: 200,
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP is incorrect",
      });
      return;
    }

    const user = await User.findOne({
      email: email,
    });

    res.json({
      code: 200,
      message: "Authentication successfully",
      token: user.token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findOne({
      token: token,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Token is incorrect",
      });
      return;
    }

    await User.updateOne(
      {
        token: token,
      },
      {
        password: md5(password),
      }
    );

    res.json({
      code: 200,
      message: "Reset password successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "Success",
      info: res.locals.user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};

// [GET] /api/v1/users/list
module.exports.list = async (req, res) => {
  try {
    const users = await User.find({
      deleted: false,
    }).select("id email fullName");
    
    res.json({
      code: 200,
      message: "Success",
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Error",
      error: error,
    });
  }
};
