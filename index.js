const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to Mongodb..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Courses", courseSchema);

async function getCourses() {
  const courses = await Course
    //
    .find({ isPublished: true, tags: { $in: ["frontend", "backend"] } })
    .sort("-price")
    .select("name author");
  console.log(courses);
}

getCourses();
