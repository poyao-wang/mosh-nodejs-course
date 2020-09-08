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
    .find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort("-price")
    .select("name author price");
  console.log(courses);
}

async function updateCourse(id) {
  const result = await Course.findByIdAndUpdate(id, {
    $set: {
      author: "Jack",
      isPublished: true,
    },
  });
  console.log(result);
}

updateCourse("5f571b0a628ca6fbd195acb4");
