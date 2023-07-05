const { Router } = require("express");

const {
  getToDo,
  saveToDo,
  deleteToDo,
  updateToDo,
} = require("../Controller/TodoController");

const router = Router();

router.get("/todo", getToDo);

router.post("/todo", saveToDo);

router.put("/todo/:id", updateToDo);

router.delete("/todo/:id", deleteToDo);

module.exports = router;
