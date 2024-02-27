import express from "express";
import connectDB from "./connect.db.js";
import Course from "./course.model.js";
import mongoose from "mongoose";
const app = express();
// make app understand json
app.use(express.json());
//?===========database connection=================
connectDB();
//?=====================routes====================
// add course
app.post("/course/add", async (req, res) => {
  const newCourse = req.body;
  await Course.create(newCourse);
  return res.status(201).send({ message: "Course Added To Database" });
});

//? get course list
app.get("/course/list", async (req, res) => {
  const courseList = await Course.find({}, { name: 1, price: 1 });
  return res.status(200).send({ message: "Success", courses: courseList });
});

//? get course details by _id
app.get("/course/details/:id", async (req, res) => {
  //extract course id from req.params

  const courseId = req.params.id;

  // validate for mongo id

  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid Mongo ID" });
  }

  //find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  //if not course throw error

  if (!requiredCourse) {
    return res.status(404).send({ message: "Course doesn't exists" });
  }

  //if course found in db SEND response with course details
  res.status(200).send({ message: "Success", courseDetails: requiredCourse });
});

//? delete course by id

app.delete("/course/delete/:id", async (req, res) => {
  //extract course id from req.params

  const courseId = req.params.id;

  // validate for mongo id

  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid Mongo ID" });
  }

  //find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  //if not course throw error

  if (!requiredCourse) {
    return res.status(404).send({ message: "Course doesn't exists" });
  }

  //if course found in db DELETE course

  await Course.deleteOne({ _id: courseId });

  // send response
  res.status(200).send({ message: "Course Deleted Successfully" });
});

//? edit course details

app.put("/course/edit/:id", async (req, res) => {
  // extract courseId from req.params

  const courseId = req.params.id;
  console.log(courseId);

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(courseId);
  console.log(isValidMongoId);
  // if not valid, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "not valid mongo ID" });
  }
  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });
  console.log(requiredCourse);
  // if not course, throw error

  if (!requiredCourse) {
    return res.status(404).send({ message: "Course does not exist" });
  }

  // get new values from req.body

  const newValues = req.body;
  //console.log(newValues);

  // edit product

  await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        name: newValues.name,
        price: newValues.price,
        tutorName: newValues.tutorName,
        duration: newValues.duration,
      },
    }
  );

  // send response

  return res.status(200).send({ message: "Edited successfully" });
});

//? Assigning port to app and creating server=========
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`App is Running at: http://localhost:${PORT}`);
});
