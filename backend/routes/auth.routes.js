const express = require("express");
const router = express.Router();
const { googleAuth, getMe } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate, googleAuthSchema } = require("../validators/schemas");

// POST /api/auth/google
router.post("/google", validate(googleAuthSchema), googleAuth);

// GET /api/auth/me
router.get("/me", authenticate, getMe);

module.exports = router;
