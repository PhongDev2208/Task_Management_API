const paginationHelper = require("../../../helpers/pagination.helper");
const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const find = {
    $or: [
      {
        createBy: userId,
      },
      {
        listUser: userId,
      },
    ],
    deleted: false,
  };

  // Filter Status
  if (req.query.status) {
    find.status = req.query.status;
  }
  // End Filter Status

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue || "asc";
  }
  // End Sort

  // Search
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // End Search

  // Pagination
  const countRecords = await Task.countDocuments(find);
  const objectPagination = paginationHelper(req.query, 2, countRecords);
  // End Pagination

  const tasks = await Task.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  res.json({
    total: countRecords,
    data: tasks,
  });
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.find({
      _id: id,
      deleted: false,
    });

    res.json(task);
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      error: error,
    });
  }
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Update status successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Update status unsuccessfully",
      error: error,
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );

        res.json({
          code: 200,
          message: "Update status successfully",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );

        res.json({
          code: 200,
          message: "Update status successfully",
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Not exist",
          error: error,
        });
        break;
    }
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Update status unsuccessfully",
      error: error,
    });
  }
};

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createBy = res.locals.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Create successfully",
      data
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

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne(
      {
        _id: id,
      },
      req.body
    );

    res.json({
      code: 200,
      message: "Update successfully",
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

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );

    res.json({
      code: 200,
      message: "Delete successfully",
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
