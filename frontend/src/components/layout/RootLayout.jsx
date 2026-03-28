import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef } from "react";
import { Home, BookOpen, Clock, Bookmark, HelpCircle, Menu, X, LogOut } from "lucide-react";

export default function RootLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Auto-close / auto-open on resize thresholds
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/courses" },
    { label: "Moments", icon: Clock, path: "#", disabled: true },
    { label: "Bookmarks", icon: Bookmark, path: "#", disabled: true },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

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
      navigate("/"); // Redirecting to landing page as per standard practice, user mentioned "dashboard" but public route logic bounces them if logged out.
  }

  return (
    <div className="flex min-h-screen bg-[#000000] text-gray-300 font-sans">
      
      {/* Header - Fixed to top left, constrained to sidebar width on desktop */}
      <header className={`flex items-center p-4 md:px-6 h-16 fixed top-0 left-0 z-[60] bg-[#000000] transition-all duration-300 ${isSidebarOpen ? 'w-full md:w-64 md:border-r border-white/5' : 'w-full md:w-20 md:bg-transparent'}`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-gray-400 hover:text-white relative cursor-pointer z-[70] transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen && window.innerWidth < 768 ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link 
          to="/" 
          className={`font-display font-medium text-xl md:text-2xl ml-4 text-white tracking-tight transition-opacity duration-300 ${!isSidebarOpen ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}
        >
          Courseify
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed top-16 bottom-0 left-0 z-50 w-64 bg-[#000000] border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.disabled) {
               return (
                <div 
                  key={item.label} 
                  className="flex items-center gap-4 px-4 py-3 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-white/5 text-white shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05),0_0_20px_0_rgba(255,255,255,0.05)]" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                <span className="font-medium text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - fixed to bottom of sidebar */}
        <div className="p-4 shrink-0 mt-auto border-t border-white/5 bg-[#000000] relative">
          <Link
            to="/why-courseify"
            className={`
              flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
              ${location.pathname === "/why-courseify" ? "text-white bg-white/5" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}
            `}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium text-[15px]">Why Courseify</span>
          </Link>
          
          <div className="mt-2 relative" ref={profileRef}>
            {/* Popover Menu matching dark aesthetics */}
            {isProfileOpen && (
                <div className="absolute bottom-full left-0 w-full mb-1">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#111111] border border-white/10 rounded-xl text-[#ff5b5b] hover:border-[#ff5b5b]/20 transition-all font-medium text-[15px] shadow-lg"
                    >
                        <span>Sign Out</span>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            )}

            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
                ${isProfileOpen ? "bg-white/5 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}
                `}
            >
                <div className="w-7 h-7 rounded-full bg-[#3d322b] text-[#d4b9a8] flex items-center justify-center font-medium text-xs shrink-0">
                {getInitials(user?.name)}
                </div>
                <span className="font-medium text-[15px] truncate">{user?.name || "Profile"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 flex flex-col min-h-screen md:pt-0 overflow-x-hidden bg-[#000000] relative transition-all duration-300
          ${isSidebarOpen ? "md:ml-64" : "ml-0"}
          ${window.innerWidth < 768 ? "pt-16" : "pt-0"}
        `}
      >
        <div className="flex-1 w-full max-w-[1000px] 2xl:max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm top-0"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
