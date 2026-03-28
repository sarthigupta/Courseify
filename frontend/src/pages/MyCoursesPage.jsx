import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseAPI } from "@/api/services";
import { Play, Trash2, CheckCircle2 } from "lucide-react";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getCourses();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this course and all progress?")) return;
    setDeletingId(courseId);
    try {
      await courseAPI.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto h-full text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-2">My Library</h1>
          <p className="text-sm text-gray-500">{courses.length} tracking {courses.length === 1 ? 'course' : 'courses'}</p>
        </div>
        <Link
          to="/courses/new"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Add Playlist
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            You don't have any courses yet. Add a YouTube playlist to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={handleDelete}
              deleting={deletingId === course._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onDelete, deleting }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      className="group bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden bg-black/50">
        <img
          src={course.thumbnail || `https://img.youtube.com/vi/default/hqdefault.jpg`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        {/* Progress bar overlay on image */}
        {course.progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-[#4F46E5] transition-all"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        )}
        {course.progressPercent === 100 && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-medium text-base text-gray-200 leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {course.title}
        </h3>
        
        {course.channelTitle && (
          <p className="text-xs text-gray-500 mb-4 truncate">{course.channelTitle}</p>
        )}

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{course.progressPercent}% / {course.totalLessons} lessons</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onDelete(e, course._id)}
              disabled={deleting}
              className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Delete course"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-colors">
              <Play className="w-3 h-3 fill-current" />
              {course.progressPercent > 0 ? "Resume" : "Start"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
