const express = require("express");
const router = express.Router();
const {
  createFromPlaylist,
  getCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/course.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate, createCourseSchema } = require("../validators/schemas");

// All course routes require authentication
router.use(authenticate);

// POST /api/courses/create-from-playlist
router.post("/create-from-playlist", validate(createCourseSchema), createFromPlaylist);

// GET /api/courses
router.get("/", getCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

// DELETE /api/courses/:id
router.delete("/:id", deleteCourse);

module.exports = router;
