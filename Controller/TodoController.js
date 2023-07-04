const ToDoModel = require("../db/todoModel");

module.exports.getToDo = async (req, res) => {
    const {id} = req.query;
    const todo = await ToDoModel.find({id});
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
    try {
        const { id } = req.query;
    
        console.log('id ---> ', req);
    
        ToDoModel
            .deleteOne({id})
            .then(() => res.status(201).send("Deleted Successfully..."))
            .catch((err) => {
                console.log(err);
                res.status(400).send("Failed to delete item.");
            });
        
    } catch (error) {
        console.log(error);
    }
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