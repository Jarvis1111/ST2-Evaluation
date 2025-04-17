const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ideaLogger")
  .then(() => console.log("Connected to MongoDB locally"))
  .catch((err) => console.error("MongoDB connection error:", err));

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Idea = mongoose.model("Idea", ideaSchema);

const addIdea = async (title, description) => {
  try {
    const newIdea = new Idea({ title, description });
    await newIdea.save();
    console.log("Idea saved successfully:", newIdea);
    return newIdea;
  } catch (error) {
    console.error("Error adding idea:", error);
    throw error;
  }
};

const getAllIdeas = async () => {
  try {
    const ideas = await Idea.find();
    console.log("Retrieved ideas:", ideas);
    return ideas;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};


app.post("/addIdea", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newIdea = await addIdea(title, description);
    res.status(201).json(newIdea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
console.log("Mongo URI:", process.env.MONGO_URI);
app.get("/ideas", async (req, res) => {
  try {
    const ideas = await getAllIdeas();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));