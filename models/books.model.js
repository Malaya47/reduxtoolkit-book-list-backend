const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  genre: String,
});

const Books2 = mongoose.model("Books2", bookSchema);

module.exports = { Books2 };
