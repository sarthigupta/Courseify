import api from "./axiosInstance";


// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
  getMe: () => api.get("/auth/me"),
};

// ─── Courses ─────────────────────────────────────────────
export const courseAPI = {
  createFromPlaylist: (playlistUrl) =>
    api.post("/courses/create-from-playlist", { playlistUrl }),

  getCourses: () => api.get("/courses"),

  getCourseById: (courseId) => api.get(`/courses/${courseId}`),

  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
};

// ─── Progress ────────────────────────────────────────────
export const progressAPI = {
  updateProgress: (data) => api.post("/progress/update", data),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
};
