import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import MyCoursesPage from "@/pages/MyCoursesPage";
import WhyCourseifyPage from "@/pages/WhyCourseifyPage";
import CreateCoursePage from "@/pages/CreateCoursePage";
import CoursePage from "@/pages/CoursePage";
import LessonPlayerPage from "@/pages/LessonPlayerPage";
import RootLayout from "@/components/layout/RootLayout";
import { Toaster } from "@/components/ui/toaster";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected — wrapped in RootLayout (navbar + sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<MyCoursesPage />} />
          <Route path="/why-courseify" element={<WhyCourseifyPage />} />
          <Route path="/courses/new" element={<CreateCoursePage />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPlayerPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
