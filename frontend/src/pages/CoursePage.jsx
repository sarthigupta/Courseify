import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseAPI } from "@/api/services";
import { formatDuration, timeAgo } from "@/utils/helpers";
import {
  Play, CheckCircle2, Clock, Layers, BarChart2, ArrowRight, ChevronRight, Lock
} from "lucide-react";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data: res } = await courseAPI.getCourseById(courseId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = () => {
    const resumeId = data?.progressSummary?.resumeLessonId;
    if (resumeId) {
      navigate(`/courses/${courseId}/lessons/${resumeId}`);
    } else if (data?.lessons?.length > 0) {
      navigate(`/courses/${courseId}/lessons/${data.lessons[0]._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="font-display text-xl font-semibold mb-2">Course not found</p>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const { course, lessons, progressSummary } = data;
  const { totalLessons, completedLessons, progressPercent } = progressSummary;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-400 hover:text-white font-medium truncate max-w-[200px]">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Course Info */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted mb-6">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handleResume}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all shadow-xl hover:scale-105"
              >
                <Play className="w-4 h-4 fill-black" />
                {progressPercent > 0 ? "Resume Learning" : "Start Course"}
              </button>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{course.title}</h1>
          {course.channelTitle && (
            <p className="text-sm text-muted-foreground mb-4">by {course.channelTitle}</p>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{progressPercent}% complete</span>
              <span className="text-muted-foreground">{completedLessons}/{totalLessons} lessons</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {course.description && (
            <div className="mb-6">
              <h2 className="font-display font-semibold mb-2">About this course</h2>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {course.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: Stats Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="font-display font-semibold mb-4">Course Info</h3>
            <ul className="space-y-3 text-sm mb-5">
              {[
                { icon: Layers, label: "Total lessons", value: totalLessons },
                { icon: CheckCircle2, label: "Completed", value: completedLessons },
                { icon: BarChart2, label: "Progress", value: `${progressPercent}%` },
                { icon: Clock, label: "Added", value: timeAgo(course.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="w-4 h-4" /> {label}
                  </span>
                  <span className="font-semibold">{value}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleResume}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Play className="w-4 h-4" />
              {progressPercent > 0 ? "Resume" : "Start"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4">
          Course Content
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({totalLessons} lessons)
          </span>
        </h2>
        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
          {lessons.map((lesson, idx) => {
            const isCompleted = lesson.progress?.completed;
            const isResume = lesson._id === String(progressSummary.resumeLessonId);
            return (
              <Link
                key={lesson._id}
                to={`/courses/${courseId}/lessons/${lesson._id}`}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors group ${isResume ? "bg-accent/30" : ""}`}
              >
                {/* Order / Check */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-border bg-background group-hover:border-primary/40 transition-colors">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="text-xs font-mono font-semibold text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 aspect-video rounded-md overflow-hidden bg-muted hidden sm:block">
                  <img
                    src={lesson.thumbnail || `https://img.youtube.com/vi/${lesson.videoId}/default.jpg`}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug truncate ${isCompleted ? "text-muted-foreground line-through" : ""}`}>
                    {lesson.title}
                  </p>
                  {isResume && (
                    <span className="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-primary">
                      <Play className="w-2.5 h-2.5 fill-primary" /> Resume here
                    </span>
                  )}
                </div>

                {/* Duration */}
                <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(lesson.durationSeconds)}
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
