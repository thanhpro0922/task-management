const Task = require("../models/task.model");

//@ [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    //@ Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue; //@@ do key đây là key người ta truyền vào động nên truyền cách này
    }
    //@ End Sort

    const tasks = await Task.find(find).sort(sort);

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
