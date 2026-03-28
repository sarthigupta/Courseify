const UserProgress = require("../models/userProgress.model");
const Lesson = require("../models/lesson.model");

/**
 * POST /api/progress/update
 * Upsert progress for a lesson (mark complete / save timestamp)
 */
const updateProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId, completed, lastWatchedTimestamp } = req.body;

    // Verify the lesson belongs to the course
    const lesson = await Lesson.findOne({ _id: lessonId, courseId });
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.userId, courseId, lessonId },
      {
        userId: req.userId,
        courseId,
        lessonId,
        completed: completed ?? false,
        lastWatchedTimestamp: lastWatchedTimestamp ?? 0,
        watchedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/progress/:courseId
 * Get all progress records for a course for the current user
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const progressRecords = await UserProgress.find({
      userId: req.userId,
      courseId,
    }).lean();

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = progressRecords.filter((p) => p.completed).length;

    res.json({
      success: true,
      progressRecords,
      summary: {
        totalLessons,
        completedLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProgress, getCourseProgress };
