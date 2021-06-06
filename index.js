const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to Mongodb..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Mosh",
    tags: ["angular", "frontend"],
    isPublished: true,
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  const courses = await Course
    //
    .find({ author: "Mosh", isPublished: true })
    .limit(10)
    .sort({ name: 1 }) // 1 for ascending, -1 for descending
    .count();
  console.log(courses);
}

getCourses();
