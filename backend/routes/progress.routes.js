const express = require("express");
const router = express.Router();
const { updateProgress, getCourseProgress } = require("../controllers/progress.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate, updateProgressSchema } = require("../validators/schemas");

router.use(authenticate);

// POST /api/progress/update
router.post("/update", validate(updateProgressSchema), updateProgress);

// GET /api/progress/:courseId
router.get("/:courseId", getCourseProgress);

module.exports = router;
