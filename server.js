const express = require('express');
const app = express();
const port = 3000;

// set up middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up task data store
let tasks = [];
let taskId = 1;

// endpoint to create a new task
app.post('/v1/tasks', (req, res) => {
  const { title } = req.body;
  const task = { id: taskId, title, is_completed: false };
  tasks.push(task);
  taskId++;
  res.status(201).json({ id: task.id });
});

// endpoint to list all tasks
app.get('/v1/tasks', (req, res) => {
  res.status(200).json({ tasks });
});

// endpoint to get a specific task
app.get('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    res.status(200).json(task);
  }
});

// endpoint to delete a specific task
app.delete('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    res.sendStatus(204);
  } else {
    tasks.splice(index, 1);
    res.sendStatus(204);
  }
});

// endpoint to edit a specific task
app.put('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, is_completed } = req.body;
  const task = tasks.find(task => task.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    task.title = title || task.title;
    task.is_completed = is_completed === undefined ? task.is_completed : is_completed;
    res.sendStatus(204);
  }
});

// endpoint to bulk add tasks
app.post('/v1/tasks/bulk', (req, res) => {
  const { tasks: newTasks } = req.body;
  const addedTasks = newTasks.map(task => {
    const newTask = { id: taskId, ...task };
    tasks.push(newTask);
    taskId++;
    return { id: newTask.id };
  });
  res.status(201).json({ tasks: addedTasks });
});

// endpoint to bulk delete tasks
app.delete('/v1/tasks/bulk', (req, res) => {
  const { tasks: deleteTasks } = req.body;
  deleteTasks.forEach(task => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  });
  res.sendStatus(204);
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
