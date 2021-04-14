// Create new router to be registered in the Express application
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// Creates a new user
router.post('/users', async (req, res) => {
  // req.body is the json object of the document
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token }); // Shorthand syntax
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // Custom methods in object is not possible without schema
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token }); // This gets data from userSchema.methods.toJSON
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    // If the token/s from the user tokens array is not the auth token, it gets stored in req.user.tokens
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Fetches all the users --> Profile of the authenticated user
// This method used to accept two parameters but now it has three with the second being the middleware
router.get('/users/me', auth, async (req, res) => {
  //// The old functionalities where the route was previously just '/users'
  // try {
  //     const users = await User.find({});
  //     res.send(users);
  // } catch (e) {
  //     res.status(500).send();
  // }
  res.send(req.user);
});

// // Fetches a specific user
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// });

// Updates a specific user
router.patch('/users/me', auth, async (req, res) => {
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
    const _id = req.user.id;
    const body = req.body;

    updates.forEach((update) => {
      req.user[update] = body[update];
    });
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    return res.status(400).send();
  }
});

//Deletes a specific user
router.delete('/users/me', auth, async (req, res) => {
  try {
    // const _id = req.user._id;
    // const user = await User.findByIdAndDelete(_id);

    // if (!user) {
    //     return res.status(500).send();
    // }

    // Achieves the same code snippet above
    await req.user.remove(); // Mongoose method

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
