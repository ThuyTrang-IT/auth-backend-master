const { Router } = require("express");

const { getToDo, saveToDo, deleteToDo, updateToDo } = require("../Controller/TodoController");

const router = Router();

router.get("/todo", getToDo);

router.post("/todo", saveToDo);

router.post("/todo/update:id", updateToDo);

router.post("/todo/delete/:id", deleteToDo);

module.exports = router;