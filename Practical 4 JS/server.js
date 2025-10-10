const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let todos = [];

app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const newTodo = { id: todos.length + 1, task };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/", (req, res) => {
  res.send("Welcome to the To-Do API! Use /todos to view or add todos.");
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});