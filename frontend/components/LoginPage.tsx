import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Languages, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles,
  Trophy,
  Star
} from "lucide-react";
import { toast } from "sonner";
import React from "react";
import { api, setAuthToken } from "../utils/api";

interface LoginPageProps {
  onLogin: (username: string, role: string, userId: string) => void;
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignUp, onNavigateToHome }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const response: any = await api.auth.login({ email: username, password }); // Assuming username input handles email
      
      if (response.success && response.token) {
        setAuthToken(response.token);
        toast.success(`Welcome back, ${response.data.full_name || response.data.username}! 🎉`);
        // Pass username, role, and id from backend
        onLogin(response.data.username, response.data.role || 'user', response.data.id);
      } else {
         toast.error(response.error || "Login failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#225d9c] via-[#288f8a] to-[#225d9c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-[#e8c02e] rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-[#e8c02e] rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full opacity-10 blur-xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block text-white space-y-6"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#e8c02e] p-3 rounded-xl">
              <Languages className="w-10 h-10 text-[#225d9c]" />
            </div>
            <span className="text-4xl">TVEnglish</span>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl text-white mb-4"
          >
            Welcome Back! 👋
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-white/90"
          >
            Continue your English learning journey and achieve your goals!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 pt-8"
          >
            {[
              { icon: <Sparkles className="w-5 h-5" />, text: "Track your progress" },
              { icon: <Trophy className="w-5 h-5" />, text: "Earn certificates" },
              { icon: <Star className="w-5 h-5" />, text: "Join 1M+ learners" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  {item.icon}
                </div>
                <span className="text-lg">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e8c02e] to-[#f0de97] rounded-bl-full opacity-20" />
          
          <button
            onClick={onNavigateToHome}
            className="text-[#225d9c] hover:underline text-sm mb-6 flex items-center gap-1"
          >
            ← Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-[#225d9c] mb-2">Login to Your Account</h2>
            <p className="text-muted-foreground mb-8">Enter your credentials to continue learning</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="username" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#225d9c]" />
                Username or Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#225d9c] transition-colors h-12"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#225d9c]" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-gray-200 focus:border-[#225d9c] transition-colors h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#225d9c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#225d9c]" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-[#225d9c] hover:underline">
                Forgot password?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#225d9c] to-[#288f8a] hover:opacity-90 text-white text-lg group"
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Don't have an account?</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={onNavigateToSignUp}
              variant="outline"
              className="mt-4 w-full h-12 border-2 border-[#e8c02e] text-[#225d9c] hover:bg-[#e8c02e] hover:text-black transition-colors"
            >
              Create Account
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}