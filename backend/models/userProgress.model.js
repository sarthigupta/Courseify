const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastWatchedTimestamp: {
      type: Number, // seconds into the video
      default: 0,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound unique index: one progress record per user per lesson
userProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model("UserProgress", userProgressSchema);
