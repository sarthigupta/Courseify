import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseAPI } from "@/api/services";
import { Play } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCourseDetails, setCurrentCourseDetails] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getCourses();
      const userCourses = data.courses || [];
      setCourses(userCourses);
      
      // Determine the "Current Commitment" - ideally the most recently interacted course
      // If we have courses, take the first one (they are returned sorted by created/updated typically)
      if (userCourses.length > 0) {
          const activeCourseId = userCourses[0]._id;
          fetchCourseDetails(activeCourseId);
      } else {
          setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    } 
  };

  const fetchCourseDetails = async (courseId) => {
      try {
          const { data } = await courseAPI.getCourseById(courseId);
          setCurrentCourseDetails(data);
      } catch (err) {
          console.error("Failed to load course details", err);
      } finally {
          setLoading(false);
      }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center text-gray-400">
          <p className="mb-4">You don't have any active courses yet.</p>
          <Link
            to="/courses/new"
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Create Your First Course
          </Link>
        </div>
      );
  }

  if (!currentCourseDetails) return null;

  const { course, lessons, progressSummary } = currentCourseDetails;
  
  // Find up next
  const resumeLessonId = progressSummary.resumeLessonId;
  const upNextLesson = lessons.find(l => l._id === resumeLessonId) || lessons[0];
  
  // Find recent activity (last 3 watched lessons or just the first few if none watched)
  const watchedLessons = lessons.filter(l => l.progress?.watchedAt).sort((a,b) => new Date(b.progress.watchedAt) - new Date(a.progress.watchedAt));
  const recentLessons = watchedLessons.length > 0 ? watchedLessons.slice(0, 3) : lessons.slice(0, 3);
  
  const remainingLessons = progressSummary.totalLessons - progressSummary.completedLessons;

  // Formatting date for activity (simplified)
  const formatTimeAgo = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1d ago";
      return `${diffDays}d ago`;
  }

  // Get recent courses (excluding the current one)
  const recentCourses = courses.filter(c => c._id !== course._id).slice(0, 3);

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto h-full text-white">
      {/* Current Commitment Section */}
      <div className="mb-12">
        <h2 className="text-[11px] font-semibold tracking-[0.2em] text-gray-500 uppercase mb-4">
          Current Commitment
        </h2>
        
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
            <h1 className="text-2xl font-display font-medium mb-1">
                {course.title.length > 30 ? course.title.substring(0, 30) + "..." : course.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4 mt-8">
                <span>{remainingLessons} Lessons Remaining</span>
                <span>{progressSummary.progressPercent}%</span>
            </div>
            
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                <div 
                    className="h-full bg-[#4F46E5] transition-all duration-500" 
                    style={{width: `${progressSummary.progressPercent}%`}}
                ></div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/5 gap-4">
                <div>
                    <div className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase mb-2">Up Next</div>
                    <div className="text-sm font-medium text-gray-200 truncate max-w-[400px]">
                        <span className="text-gray-500 mr-2">
                            {String(upNextLesson.order).padStart(2, '0')}
                        </span>
                        {upNextLesson.title}
                    </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/courses/${course._id}/lessons/${upNextLesson._id}`)}
                  className="flex items-center gap-2 text-sm font-medium text-[#c7d2fe] hover:text-white transition-colors ml-auto sm:ml-0"
                >
                    Resume <Play className="w-3 h-3 fill-current" />
                </button>
            </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-12">
        <h2 className="text-[11px] font-semibold tracking-[0.2em] text-gray-500 uppercase mb-6">
          Recent Activity ({recentLessons.length})
        </h2>
        
        <div className="space-y-6">
            {recentLessons.map((lesson) => (
                <div key={lesson._id} className="flex justify-between items-start group">
                    <div>
                        <h3 className="text-[15px] font-medium text-gray-200 group-hover:text-white transition-colors mb-1">
                            {lesson.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {course.title.length > 50 ? course.title.substring(0, 50) + "..." : course.title}
                        </p>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4 mt-1">
                        {lesson.progress?.watchedAt ? formatTimeAgo(lesson.progress.watchedAt) : "Not started"}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Recent Courses List */}
      {recentCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] text-gray-500 uppercase mb-6 pt-8 border-t border-white/5">
              Other Recent Courses ({recentCourses.length})
            </h2>
            <div className="space-y-6">
                {recentCourses.map((recentCourse) => (
                    <div key={recentCourse._id} className="flex justify-between items-start group cursor-pointer" onClick={() => navigate(`/courses/${recentCourse._id}`)}>
                        <div>
                            <h3 className="text-[15px] font-medium text-gray-200 group-hover:text-white transition-colors mb-1">
                                {recentCourse.title.length > 50 ? recentCourse.title.substring(0, 50) + "..." : recentCourse.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {recentCourse.channelTitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 ml-4 mt-1">
                            <span className="text-xs text-gray-500">{recentCourse.progressPercent}%</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                                <div 
                                    className="h-full bg-[#4F46E5]" 
                                    style={{width: `${recentCourse.progressPercent}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Footer Footer Link */}
      <div className="flex justify-between items-center text-sm pt-8 border-t border-white/5 mb-8">
          <span className="text-gray-500">{courses.length} total courses</span>
          <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
              View Library
          </Link>
      </div>
    </div>
  );
}
