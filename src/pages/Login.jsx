import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ImageSlider } from "@/components/ui/image-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Apple, ShieldAlert, X } from "lucide-react";
import Home from "./Home";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect path
  const from = location.state?.from?.pathname || "/";

  const redirectUser = (user) => {
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "vendor") {
      navigate("/vendor", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      redirectUser(user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background: Blurred E-Commerce site */}
      <div className="absolute inset-0 filter blur-[12px] opacity-85 pointer-events-none select-none overflow-hidden scale-[1.02]">
        <Home />
      </div>

      {/* Glassmorphic Overlay Layer */}
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate("/");
          }
        }}
        className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[16px] p-4 z-50 cursor-pointer"
      >
        <motion.div 
          className="relative w-full max-w-5xl h-[720px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/95 cursor-default"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Close button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 active:bg-slate-200/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Close login screen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left side: Image Slider */}
          <div className="hidden lg:block relative w-full h-full">
            <ImageSlider images={images} interval={4000} />
            {/* Overlay styling for modern glassmorphism aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
              <span className="text-xl font-black text-white drop-shadow">
                Tech-Hub <span className="text-blue-400">AI</span>
              </span>
            </div>
          </div>

          {/* Right side: Login Form */}
          <div className="w-full h-full bg-card text-card-foreground flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto no-scrollbar">
            <motion.div 
              className="w-full max-w-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2 text-slate-900">
              Welcome Back
            </motion.h1>
            <motion.p variants={itemVariants} className="text-slate-500 mb-6 text-sm">
              Enter your credentials to access your account.
            </motion.p>

            {error && (
              <motion.div 
                variants={itemVariants}
                className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-2xl flex items-start gap-2 mb-4"
              >
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="w-full rounded-2xl py-5" onClick={(e) => e.preventDefault()}>
                <Chrome className="mr-2 h-4 w-4 text-slate-600" />
                Google
              </Button>
              <Button variant="outline" className="w-full rounded-2xl py-5" onClick={(e) => e.preventDefault()}>
                <Apple className="mr-2 h-4 w-4 text-slate-900" />
                Apple
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl py-5 border-slate-200 focus-visible:ring-blue-500/20"
                  required 
                />
              </div>
              <div className="space-y-1.5">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                    <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                 </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl py-5 border-slate-200 focus-visible:ring-blue-500/20"
                  required 
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs mt-2">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </motion.form>

            <motion.p variants={itemVariants} className="text-center text-xs text-slate-500 mt-6 font-semibold">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-blue-600 hover:underline">
                Sign up
              </a>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
