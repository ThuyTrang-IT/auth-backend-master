const { Router } = require("express");

const { getToDo, saveToDo, deleteToDo, updateToDo } = require("../Controller/TodoController");

const router = Router();

router.get("/", getToDo);

router.post("/todo", saveToDo);

router.post("/update", updateToDo);

router.post("/delete", deleteToDo);

module.exports = router;