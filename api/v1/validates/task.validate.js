module.exports.create = async (req, res, next) => {
  if (req.body.title?.trim() == "") {
    res.json({
      code: 400,
      message: "Title is required!",
    });
    return;
  }

  if (req.body.title?.length < 5) {
    res.json({
      code: 400,
      message: "Title is at least 5 characters!",
    });
    return;
  }

  next();
};
