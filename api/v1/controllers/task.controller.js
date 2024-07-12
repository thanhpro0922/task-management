const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

//@ [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }

    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    //@ Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );
    //@ Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue; //@@ do key đây là key người ta truyền vào động nên truyền cách này
    }
    //@ End Sort

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json(tasks);
};

//@ [GET]/api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false,
        });
        res.json(task);
    } catch (error) {
        res.json("Ko tìm thấy!");
    }
};

//@ [PATCH] /api/v1/tasks/change-status/:id
module.exports.changStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const status = req.body.status;

        await Task.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200, //@@ 200 có nghĩa là thành công, để cho ô FE biết thành công và làm gì đó
            message: "Cập nhật trạng thái thành công!",
        });
    } catch (error) {
        res.json({
            code: 400, //@@ 400 có nghĩa là lỗi, để cho ô FE biết thành công và làm gì đó
            message: "Không tồn tại!",
        });
    }
};

//@ [PATCH] /api/v1/tasks/change-multi
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
                    message: "Cập nhật trạng thái thành công!",
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
                    message: "Xóa thành công!",
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!",
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!",
        });
    }
};

//@ [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id; //! req.user.id là do bên requireAuth mình cs trả về và mình có nhúng toàn bộ task bên file route nên ở đây dùng được
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: data,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
};

//@ [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        await Task.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
};

//@ [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Task.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        );

        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
};
