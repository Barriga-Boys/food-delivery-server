// Create new router to be registered in the Express application
const express = require('express');
const User = require('../models/user');
const router = new express.Router();

// Creates a new user
router.post('/users', async (req, res) => {
  // req.body is the json object of the document
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Fetches all the users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Fetches a specific user
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  // Allowable properties from the collection to be updated
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  // Loops through every key in updates. If a key is not in allowedUpdates, isValidOperation is false
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const _id = req.params.id;
    const body = req.body;
    const user = await User.findByIdAndUpdate(_id, body, {
      new: true, // Returns the new user and not the user before update
      runValidators: true, // Makes sure to run the validators before the update
    });
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    return res.status(400).send();
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(500).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
