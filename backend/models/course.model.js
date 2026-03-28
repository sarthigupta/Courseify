const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    playlistId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    channelTitle: {
      type: String,
      default: "",
    },
    totalVideos: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster user-specific queries
courseSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Course", courseSchema);
