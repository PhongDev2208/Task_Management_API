module.exports.register = async (req, res, next) => {
  if (req.body.fullName.trim() == "") {
    res.json({
      code: 400,
      message: "FullName is required!",
    });
    return;
  }

  if (req.body.fullName.length < 5) {
    res.json({
      code: 400,
      message: "FullName is at least 5 characters!",
    });
    return;
  }

  if (req.body.email.trim() == "") {
    res.json({
      code: 400,
      message: "Email is required!",
    });
    return;
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (!validateEmail(req.body.email)) {
    res.json({
      code: 400,
      message: "Email is invalid!",
    });
    return;
  }

  if (req.body.password.trim() == "") {
    res.json({
      code: 400,
      message: "Password is required!",
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.json({
      code: 400,
      message: "Password is at least 6 characters!",
    });
    return;
  }

  next();
};

module.exports.login = async (req, res, next) => {
  

  if (req.body.email.trim() == "") {
    res.json({
      code: 400,
      message: "Email is required!",
    });
    return;
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (!validateEmail(req.body.email)) {
    res.json({
      code: 400,
      message: "Email is invalid!",
    });
    return;
  }

  if (req.body.password.trim() == "") {
    res.json({
      code: 400,
      message: "Password is required!",
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.json({
      code: 400,
      message: "Password is at least 6 characters!",
    });
    return;
  }

  next();
};
