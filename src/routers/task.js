const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

// Creates a new task
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Fetches all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Fetches a specific task
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(400).send();
    }

    res.send(task);
  } catch (e) {
    res.send(404).send();
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.send(400).send();
  }
  try {
    const task = await Task.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.send(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      return res.status(500).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
