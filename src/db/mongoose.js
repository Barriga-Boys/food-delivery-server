const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/food-delivery-api', {
  useNewUrlParser: true,
  useCreateIndex: true, // Creates index when mongoose is working with mongodb
  useUnifiedTopology: true,
  useFindAndModify: false,
});
