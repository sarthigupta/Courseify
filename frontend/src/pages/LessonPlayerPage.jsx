import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseAPI, progressAPI } from "@/api/services";
import { formatDuration } from "@/utils/helpers";
import {
  CheckCircle2, Clock, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Play, BookOpen, BarChart2, Menu, X, ArrowLeft
} from "lucide-react";

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (courseData?.lessons) {
      const lesson = courseData.lessons.find((l) => l._id === lessonId);
      setCurrentLesson(lesson || courseData.lessons[0]);
    }
  }, [lessonId, courseData]);

  const fetchData = async () => {
    try {
      const { data } = await courseAPI.getCourseById(courseId);
      setCourseData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = useCallback(
    async (completed = false, timestamp = 0) => {
      if (!currentLesson) return;
      try {
        await progressAPI.updateProgress({
          courseId,
          lessonId: currentLesson._id,
          completed,
          lastWatchedTimestamp: timestamp,
        });
        // Update local state
        setCourseData((prev) => {
          const oldLesson = prev.lessons.find((l) => l._id === currentLesson._id);
          const wasCompleted = oldLesson?.progress?.completed;
          
          let newCompletedCount = prev.progressSummary?.completedLessons || 0;
          if (!wasCompleted && completed) newCompletedCount += 1;
          else if (wasCompleted && !completed) newCompletedCount = Math.max(0, newCompletedCount - 1);
          
          const total = prev.progressSummary?.totalLessons || prev.lessons.length;
          const newProgressPercent = total > 0 ? Math.round((newCompletedCount / total) * 100) : 0;

          return {
            ...prev,
            progressSummary: {
              ...prev.progressSummary,
              completedLessons: newCompletedCount,
              progressPercent: newProgressPercent
            },
            lessons: prev.lessons.map((l) =>
              l._id === currentLesson._id
                ? { ...l, progress: { ...l.progress, completed, lastWatchedTimestamp: timestamp } }
                : l
            ),
          };
        });
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    },
    [courseId, currentLesson]
  );

  const handleMarkComplete = async () => {
    setMarkingDone(true);
    await saveProgress(true, 0);
    setMarkingDone(false);
    // Auto-advance to next lesson
    const lessons = courseData?.lessons || [];
    const currentIdx = lessons.findIndex((l) => l._id === currentLesson._id);
    if (currentIdx < lessons.length - 1) {
      const nextLesson = lessons[currentIdx + 1];
      navigate(`/courses/${courseId}/lessons/${nextLesson._id}`);
    }
  };

  const navigateLesson = (direction) => {
    const lessons = courseData?.lessons || [];
    const currentIdx = lessons.findIndex((l) => l._id === currentLesson?._id);
    const targetIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx >= 0 && targetIdx < lessons.length) {
      navigate(`/courses/${courseId}/lessons/${lessons[targetIdx]._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lessons = courseData?.lessons || [];
  const course = courseData?.course;
  const progress = courseData?.progressSummary;
  const currentIdx = lessons.findIndex((l) => l._id === currentLesson?._id);
  const isCompleted = currentLesson?.progress?.completed;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < lessons.length - 1;

  return (
    <div className="flex flex-row-reverse h-[calc(100vh-64px)] overflow-hidden bg-[#000000]">
      {/* ─── Lesson Sidebar ─── */}
      <aside
        className={`
          ${sidebarOpen ? "w-80 border-l border-white/10" : "w-0"} 
          flex-shrink-0 bg-[#000000] overflow-hidden transition-all duration-300
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to course
          </Link>
          <h2 className="font-display font-semibold text-sm leading-tight line-clamp-2 mb-2">
            {course?.title}
          </h2>
          {/* Course progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{progress?.completedLessons}/{progress?.totalLessons} lessons</span>
              <span className="font-semibold text-foreground">{progress?.progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto lesson-sidebar">
          {lessons.map((lesson, idx) => {
            const isCurrent = lesson._id === currentLesson?._id;
            const isDone = lesson.progress?.completed;
            return (
              <button
                key={lesson._id}
                onClick={() => navigate(`/courses/${courseId}/lessons/${lesson._id}`)}
                className={`
                  w-full text-left px-4 py-3 flex items-start gap-3 border-b border-white/5
                  transition-colors
                  ${isCurrent ? "bg-white text-black" : "hover:bg-white/10 text-white"}
                `}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className={`w-5 h-5 ${isCurrent ? "text-emerald-600" : "text-emerald-500"}`} />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <Play className="w-3 h-3 fill-white text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                      <span className="text-[11px] font-mono text-white">{idx + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug font-medium line-clamp-2 ${isCurrent ? "text-black" : "text-white"}`}>
                    {lesson.title}
                  </p>
                  <span className={`text-xs mt-0.5 flex items-center gap-1 ${isCurrent ? "text-black/70" : "text-white/70"}`}>
                    <Clock className="w-3 h-3" />
                    {formatDuration(lesson.durationSeconds)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:block">{sidebarOpen ? "Hide" : "Show"} contents</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateLesson("prev")}
              disabled={!hasPrev}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground font-mono">
              {currentIdx + 1} / {lessons.length}
            </span>
            <button
              onClick={() => navigateLesson("next")}
              disabled={!hasNext}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 overflow-y-auto bg-[#000000] flex flex-col">
          <div className="flex-1 w-full max-w-[1800px] mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col min-h-[500px]">
            {/* Video */}
            <div className="flex-1 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-4 lg:mb-6 bg-black relative min-h-0">
              {currentLesson ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentLesson.videoId}?autoplay=1&rel=0&modestbranding=1${currentLesson.progress?.lastWatchedTimestamp ? `&start=${Math.floor(currentLesson.progress.lastWatchedTimestamp)}` : ''}`}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                  No lesson selected
                </div>
              )}
            </div>

            {/* Lesson Info + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <span className="font-mono">Lesson {currentIdx + 1}</span>
                  <span>·</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDuration(currentLesson?.durationSeconds)}</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                  {currentLesson?.title}
                </h1>
              </div>

              {/* Mark Complete / Next */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingDone}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 transition-colors"
                  >
                    {markingDone ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Mark Complete
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={() => navigateLesson("next")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
