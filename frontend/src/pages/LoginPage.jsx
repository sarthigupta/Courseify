import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/api/services";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleSignIn;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const initGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 300,
      text: "continue_with",
      shape: "rectangular",
    });
  };

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await authAPI.googleLogin(response.credential);
      setAuth(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Column - Branding and Text */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 lg:p-16 relative overflow-hidden border-r border-white/5">
        {/* User-provided background overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-0.5 -translate-y-1/2 w-[200px] h-[125px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[150px] h-[150px] border border-white/5 rounded-full opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-[100px] h-[100px] border border-white/5 rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10">
          {/* Logo placed matching the screenshot */}
          <div className="flex items-center gap-2 mb-[20vh]">
            <span 
              onClick={() => navigate("/")} 
              className="font-display font-bold text-xl tracking-tight text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              Courseify
            </span>
          </div>

          <h1 className="text-5xl xl:text-[4rem] font-medium tracking-tight text-white leading-[1.1] mb-6">
            Pick something <br />
            <span className="text-gray-500">worth finishing.</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-sm font-light">
            We'll keep everything else out of the way.
          </p>
        </div>

        <div className="relative z-10 text-gray-500 text-sm flex items-center gap-2">
            <span>© 2026 Courseify</span>
        </div>
      </div>

      {/* Right Column - Login Button */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#0a0a0a] p-8">
        <div className="w-full max-w-md flex flex-col items-center">
            
          {/* Box around sign in */}
          <div className="w-full bg-[#111111] border border-white/10 rounded-2xl p-8 mb-6 shadow-2xl flex flex-col items-center justify-center min-h-[140px]">
            {/* Google Sign-In Button Container */}
            <div className="flex flex-col items-center rounded-2xl gap-4 w-full">
              <div ref={googleBtnRef} className="flex justify-center w-full [&>div]:mx-auto" />

              {loading && (
                <div className="flex items-center gap-2 rounded-full text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing you in...
                </div>
              )}

              {error && (
                <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
