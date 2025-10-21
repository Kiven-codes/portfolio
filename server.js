const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Datastore({
  filename: path.join(__dirname, "messages.db"),
  autoload: true,
});

// Save message
app.post("/api/messages", (req, res) => {
  const { name, email, message, createdAt } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Missing fields" });
  const doc = {
    name,
    email,
    message,
    createdAt: createdAt || new Date().toISOString(),
  };
  db.insert(doc, (err, newDoc) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.status(201).json({ id: newDoc._id });
  });
});

// (optional) Get all messages - remove or secure in production
app.get("/api/messages", (req, res) => {
  db.find({})
    .sort({ createdAt: -1 })
    .exec((err, docs) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(docs);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
