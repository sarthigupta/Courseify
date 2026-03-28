import { useState, useRef, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, ChevronDown, Circle, LayoutTemplate, Play, Trophy, LogOut, Heart, Github } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LandingPage() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const [openFaq, setOpenFaq] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
      logout();
      setIsProfileOpen(false);
  };

  const features = [
    {
      icon: LayoutTemplate,
      title: "Distraction-free by default",
      description: "No recommendations. No comments. No noise.",
    },
    {
      icon: Trophy,
      title: "Progress is explicit",
      description: "You always know what's done and what isn't.",
    },
    {
      icon: BookOpen,
      title: "Structure from chaos",
      description: "Any playlist becomes a clear, finite course.",
    },
  ];

  const faqs = [
    {
      question: "Why not just use YouTube?",
      answer:
        "YouTube is designed to keep you clicking videos, not finishing them. Courseify removes distractions, recommendations, and lets you track your progress like a real course platform.",
    },
    {
      question: "Is this trying to replace YouTube?",
      answer:
        "No, Courseify simply embed YouTube videos in a distraction-free environment. Think of it as a better interface for learning from YouTube.",
    },
    {
      question: "Does it work with unlisted playlists?",
      answer:
        "Yes, as long as you have the link to the unlisted playlist, you can import it into Courseify.",
    },
    {
      question: "What makes Courseify different from other course platforms?",
      answer:
        "Courseify acts as a wrapper around existing free content on YouTube, bringing structure and progress tracking without the steep price tags of premium course platforms.",
    },
    {
      question: "Is this free?",
      answer: "Yes, Courseify is currently completely free to use.",
    },
  ];

  const handleToggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <div className="border-b border-white/10">
        <nav className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <span onClick={() => navigate("/")} className="font-display font-medium text-sm sm:text-xl tracking-tight cursor-pointer">
              Courseify
            </span>
          </div>
          <div>
            {isAuthenticated ? (
               <div className="relative" ref={profileRef}>
                  {/* Popover Menu */}
                  {isProfileOpen && (
                      <div className="absolute top-[120%] right-0 w-48 mb-1 z-50">
                          <button 
                              onClick={handleLogout}
                              className="w-full flex items-center justify-between px-4 py-3 bg-[#111111] border border-white/10 rounded-xl text-[#ff5b5b] hover:border-[#ff5b5b]/20 transition-all font-medium text-[15px] shadow-lg"
                          >
                              <span>Sign Out</span>
                              <LogOut className="w-4 h-4" />
                          </button>
                      </div>
                  )}

                 <div 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="w-10 h-10 rounded-full bg-[#3d322b] text-[#d4b9a8] flex items-center justify-center font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity"
                 >
                   {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                 </div>
               </div>
            ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-black hover:bg-gray-100 border border-gray-400 px-5 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-colors"
                >
                  Sign in
                </button>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className='text-center max-w-3xl mx-auto mb-4 sm:mb-16 md:mb-16'>
          <h1 className={`text-3xl sm:text-5xl md:text-7xl font-medium tracking-tighter text-white mb-3 sm:mb-8 leading-[1.1] sm:leading-[0.95] transition-all duration-1000 ease-out transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>Escape the algorithm. <br />Complete the course.</h1>
          <p className={`text-base sm:text-xl md:text-2xl text-neutral-400 font-light max-w-xl mx-auto leading-tight mb-5 sm:mb-12 transition-all duration-1000 ease-out delay-300 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>Youtube is built to keep you watching. <br /> Courseify is built to help you complete.</p>
        </div>

        <button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          className={`bg-white text-black border border-gray-400 hover:bg-gray-100 px-16 py-3 rounded-lg font-medium text-base transition-all duration-1000 ease-out delay-500 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          Continue Learning
        </button>
      </section>

      {/* Browser Mockup Section */}
      <section className={`px-6 py-12 max-w-6xl mx-auto relative transition-all duration-1000 ease-out delay-700 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
        <div className="text-center mb-5 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          What learning looks like without the algorithm
        </div>

        {/* Mockup Window */}
        <div className="rounded-xl border border-gray-800 bg-[#0A0A0A] shadow-2xl overflow-hidden shadow-black/50 aspect-video max-h-[700px] flex flex-col">
          {/* Title bar */}
          <div className="h-12 bg-[#121212] flex items-center px-4 border-b border-gray-800 relative shadow-sm">
            {/* Window controls */}
            <div className="flex gap-2 absolute left-4">
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
            </div>

            {/* Address bar */}
            <div className="mx-auto flex items-center bg-[#1A1A1A] rounded-md px-4 py-1.5 w-1/2 max-w-md border border-gray-800/50 text-xs">
              <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap opacity-80">
                <span className="font-semibold text-gray-200">courseify.com</span>
                <span className="text-gray-500">/home/course/react-mastery</span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Gradient fade on the left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10" />

            {/* Sidebar Mockup */}
            <div className="w-72 bg-[#111116] border-r border-gray-800/50 flex-shrink-0 p-5 hidden md:block">
              <div className="flex items-center gap-2 mb-8 font-semibold text-white">
                <BookOpen className="w-5 h-5 text-white" />
                <span>React Mastery</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 text-sm py-1">
                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  <span className="truncate">Chapter 1: Fundamentals</span>
                </div>
                {/* Active state item */}
                <div className="flex items-center gap-3 bg-gray-800/40 text-white text-sm py-2 px-3 -mx-3 rounded-lg border border-gray-700/50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                  <span className="truncate">Chapter 2: Advanced H...</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm py-1">
                  <Circle className="w-5 h-5 text-gray-500" />
                  <span className="truncate">Chapter 3: State Manage...</span>
                </div>
              </div>
            </div>

            {/* Video Player Mockup */}
            <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
              {/* Play Button Center */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/20 transition group">
                <Play className="w-6 h-6 text-white group-hover:scale-110 transition-transform ml-1" fill="currentColor" />
              </div>

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent px-6 flex items-center justify-between text-gray-300 text-xs">
                <Play className="w-4 h-4" />
                <div className="flex-1 mx-4 bg-gray-800 h-1 rounded-full relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-white rounded-full"></div>
                </div>
                <div className="flex gap-4 items-center font-mono">
                  <span>14:20 / 45:00</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-4 sm:py-24 md:py-32  sm:px-6 mx-auto border-t border-white/5 mt-12 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto z-10">
          <div className="grid md:grid-cols-3 gap-12 sm:gap-12 md:gap-16">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-gray-800 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-white " />
                  </div>
                  <h3 className="font-display font-medium text-base sm:text-xl mb-5 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 font-light leading-relaxed text-base sm:text-lg">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Steps Section */}
      <section className="px-6 py-20 text-center border-t border-b border-white/5 bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xl font-display font-medium text-white">
          <span>Add a playlist</span>
          <span className="text-gray-400 hidden md:inline">→</span>
          <span className="text-gray-400 md:hidden">↓</span>
          <span>Get a Course</span>
          <span className="text-gray-400 hidden md:inline">→</span>
          <span className="text-gray-400 md:hidden">↓</span>
          <span>Complete it</span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl tracking-tight font-medium text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-white/5 pb-4 last:border-0"
              >
                <button
                  onClick={() => handleToggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-2 focus:outline-none group"
                >
                  <span className="font-medium text-white group-hover:text-gray-200 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="mt-2 text-gray-300 text-sm leading-relaxed pr-8 py-2 animate-in fade-in slide-in-from-top-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center border-t border-white/5 mt-auto bg-[#0a0a0a]">
        <div className="max-w-md mx-auto mb-8">
          <p className="text-neutral-400 text-sm mb-4">
            Courseify is built for people who want to complete what they start.
          </p>
          <p className="text-neutral-400 text-sm italic">
            No feed. No recommendations. No noise.
          </p>
        </div>
        <div className="text-neutral-400 text-sm flex flex-col items-center justify-center gap-2">
          <span>© 2026 Courseify</span>
          <a href="https://github.com/Sarthi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10 mt-2 tracking-wide font-medium shadow-sm transition-colors hover:bg-white/10 hover:text-white group cursor-pointer">
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" /> Builded by Sarthi
          </a>
        </div>
      </footer>
    </div>
  );
}
