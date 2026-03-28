const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const UserProgress = require("../models/userProgress.model");
const youtubeService = require("../services/youtube.service");

/**
 * POST /api/courses/create-from-playlist
 * Fetch YouTube playlist, create Course + Lessons
 */
const createFromPlaylist = async (req, res, next) => {
  try {
    const { playlistUrl } = req.body;

    // Extract playlist ID from URL
    const playlistId = youtubeService.extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return res.status(400).json({ success: false, message: "Invalid YouTube playlist URL" });
    }

    // Check if this user already has this playlist as a course
    const existing = await Course.findOne({ playlistId, createdBy: req.userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a course from this playlist",
        courseId: existing._id,
      });
    }

    // Fetch playlist details + videos from YouTube API
    const { playlistInfo, videos } = await youtubeService.fetchPlaylistData(playlistId);

    // Create the Course document
    const course = await Course.create({
      title: playlistInfo.title,
      description: playlistInfo.description,
      playlistId,
      thumbnail: playlistInfo.thumbnail,
      channelTitle: playlistInfo.channelTitle,
      totalVideos: videos.length,
      createdBy: req.userId,
    });

    // Bulk-insert all Lessons
    const lessonDocs = videos.map((video, index) => ({
      courseId: course._id,
      title: video.title,
      videoId: video.videoId,
      thumbnail: video.thumbnail,
      duration: video.duration,
      durationSeconds: video.durationSeconds,
      description: video.description,
      order: index + 1,
    }));

    const lessons = await Lesson.insertMany(lessonDocs);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
      lessonsCount: lessons.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses
 * Get all courses for the authenticated user
 */
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .lean();    //lean give normal java script object

    // Attach progress percentage for each course
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalLessons = await Lesson.countDocuments({ courseId: course._id });
        const completedLessons = await UserProgress.countDocuments({
          userId: req.userId,
          courseId: course._id,
          completed: true,
        });
        return {
          ...course,
          totalLessons,
          completedLessons,
          progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        };
      })
    );

    res.json({ success: true, courses: coursesWithProgress });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Get a single course with all lessons + user progress
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    }).lean();

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean();

    const progressRecords = await UserProgress.find({
      userId: req.userId,
      courseId: course._id,
    }).lean();

    // Map progress to lessons
    const progressMap = {};
    progressRecords.forEach((p) => {
      progressMap[p.lessonId.toString()] = p;
    });

    const lessonsWithProgress = lessons.map((lesson) => ({
      ...lesson,
      progress: progressMap[lesson._id.toString()] || null,
    }));

    // Find first uncompleted lesson in sequential order
    const firstIncompleteLesson = lessonsWithProgress.find((l) => !l.progress?.completed);

    // Find last watched uncompleted lesson (resume point)
    const lastProgress = progressRecords
      .filter((p) => !p.completed)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))[0];

    const completedCount = progressRecords.filter((p) => p.completed).length;

    let resumeLessonId = lastProgress?.lessonId;
    if (!resumeLessonId && firstIncompleteLesson) {
      resumeLessonId = firstIncompleteLesson._id;
    }
    if (!resumeLessonId && lessons.length > 0) {
      resumeLessonId = lessons[0]._id; // fallback if all completed or no lessons
    }

    res.json({
      success: true,
      course,
      lessons: lessonsWithProgress,
      progressSummary: {
        totalLessons: lessons.length,
        completedLessons: completedCount,
        progressPercent: lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
        resumeLessonId: resumeLessonId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/courses/:id
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Cascade delete lessons and progress
    await Lesson.deleteMany({ courseId: course._id });
    await UserProgress.deleteMany({ courseId: course._id });

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createFromPlaylist, getCourses, getCourseById, deleteCourse };
