const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const { Books2 } = require("./models/books.model");

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/books", async (req, res) => {
  try {
    const allbooks = await Books2.find();
    res.json(allbooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  const { bookName, author, genre } = req.body;

  try {
    const bookData = new Books2({ bookName, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Books2.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/books/updateBook/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBookDetails = req.body;
    const updatedBook = await Books2.findByIdAndUpdate(
      bookId,
      updatedBookDetails,
      {
        new: true,
      }
    );
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully", updatedBook });
    } else {
      res.status(404).json({ error: "Book not found and not updated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
