const { z } = require("zod");

// ─── Auth ───────────────────────────────────────────────
const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

// ─── Course ─────────────────────────────────────────────
const createCourseSchema = z.object({
  playlistUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      "Must be a YouTube URL"
    )
    .refine(
      (url) => url.includes("list="),
      "URL must contain a playlist ID (list= parameter)"
    ),
});

// ─── Progress ────────────────────────────────────────────
const updateProgressSchema = z.object({
  courseId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid courseId"),
  lessonId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid lessonId"),
  completed: z.boolean().optional(),
  lastWatchedTimestamp: z.number().min(0).optional(),
});

/**
 * Generic Zod validation middleware factory
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(422).json({ success: false, errors });
  }
  req.body = result.data; // use parsed/coerced data
  next();
};

module.exports = {
  validate,
  googleAuthSchema,
  createCourseSchema,
  updateProgressSchema,
};
