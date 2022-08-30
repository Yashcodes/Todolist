const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/todolist")
  .then(() => {
    console.log("Database connected successfully🙂");
  })
  .catch(() => {
    console.log("Connection error😒");
  });

  

  