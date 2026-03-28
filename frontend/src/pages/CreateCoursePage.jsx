import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseAPI } from "@/api/services";
import { Link2, Sparkles, ArrowRight, AlertCircle, CheckCircle2, BookOpen } from "lucide-react";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setLoading(true);

    try {
      const { data } = await courseAPI.createFromPlaylist(url.trim());
      navigate(`/courses/${data.course._id}`);
    } catch (err) {
      const msg = err.response?.data?.message;
      const courseId = err.response?.data?.courseId;
      if (courseId) {
        navigate(`/courses/${courseId}`);
        return;
      }
      setError(msg || "Failed to create course. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const exampleUrls = [
    "https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5ux32dnih",
    "https://www.youtube.com/playlist?list=PL4cUxeGkcC9g9gP2onazU5-2M7lWSdSzk",
  ];

  const steps = [
    { step: "01", title: "Paste URL", desc: "Drop any YouTube playlist link into the box below" },
    { step: "02", title: "We Fetch", desc: "Courseify pulls all videos and metadata automatically" },
    { step: "03", title: "Start Learning", desc: "Your structured course is ready to track & complete" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-11">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Stop Scrolling, Start Learning.
        </div>
        <h1 className="font-display text-4xl font-bold mb-3">Turn a playlist into a course</h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Paste a YouTube playlist URL and we'll structure it into a Udemy-style learning experience.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {steps.map(({ step, title, desc }) => (
          <div key={step} className="text-center">
            <div className="font-mono text-xs font-bold text-white/60 mb-2">{step}</div>
            <div className="font-display font-semibold text-sm mb-1">{title}</div>
            <div className="text-xs text-white/60 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-black mb-2">YouTube Playlist URL</label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="w-full text-black pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Example URLs */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {exampleUrls.map((exUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setUrl(exUrl)}
                className="text-xs text-primary hover:text-primary/80 underline underline-offset-2"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Fetching playlist...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Create Course
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Requirements */}
      <div className="mt-6 p-4 bg-gray-300 rounded-xl">
        <p className="text-xs font-semibold text-black mb-2">Requirements</p>
        <ul className="space-y-1.5">
          {[
            "Playlist must be public or unlisted",
            "URL must include the list= parameter",
            "Works with any channel's public playlist",
          ].map((req) => (
            <li key={req} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
