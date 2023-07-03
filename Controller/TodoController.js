const ToDoModel = require("../db/todoModel");

module.exports.getToDo = async (req, res) => {
    const todo = await ToDoModel.find();
    res.send(todo);
}

module.exports.saveToDo = (req, res) => {
    const { text } = req.body;

    ToDoModel
        .create({ text })
        .then((data) =>{ 
            console.log("Added Successfully...")
            console.log(data)
            res.send(data)
        })
        .catch((err) => console.log(err));
}

module.exports.deleteToDo = (req, res) => {
    const { id } = req.params;

    console.log('id ---> ', id);

    ToDoModel
        .findByIdAndDelete(id)
        .then(() => res.status(201).send("Deleted Successfully..."))
        .catch((err) => {
            console.log(err);
            res.status(400).send("Failed to delete item.");
        });
}

module.exports.updateToDo = (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    ToDoModel
        .findByIdAndUpdate(id, { text })
        .then(() => res.status(201).send("Updated Successfully..."))
        .catch((err) => {
            console.log(err);
            res.status(400).send("Failed to update item.");
        });
}