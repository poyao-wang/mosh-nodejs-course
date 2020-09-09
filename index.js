const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to Mongodb..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
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
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    //
    .find({ author: "Mosh", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1 for ascending, -1 for descending
    .count();
  console.log(courses);
}

createCourse();
