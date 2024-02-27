import mongoose from "mongoose";
//? set Rule

const courseSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  price: Number,
  tutorName: String,
});

//? Create Table

const Course = mongoose.model("Course", courseSchema);

//? Export Schema

export default Course;
