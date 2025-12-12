import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Languages, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Check,
  Rocket,
  Gift,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface SignUpPageProps {
  onSignUp: (username: string, email: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export function SignUpPage({ onSignUp, onNavigateToLogin, onNavigateToHome }: SignUpPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call API to register user
      // Note: We're not automatically logging in here, but we could if the API returned a token.
      // Usually after signup, we ask user to login or redirect to login.
      // Based on API signature: register(body: any)
      const response: any = await import("../utils/api").then(m => m.api.auth.register({
        username,
        email,
        password,
        // full_name is optional in backend, not constructing it here yet
      }));

      // Assuming verifying response success in API utility or here
      // The API utility throws if !response.ok, so if we get here, it succeeded.
      // But let's check response.success if it returns a wrapper.
      if (response.success) {
          toast.success(`Account created! Welcome, ${username}! 🎉`);
          // Optionally log them in immediately if token is present, OR redirect to login.
          // For now, let's call onSignUp which might just set state or navigate.
          onSignUp(username, email);
      } else {
          toast.error(response.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length >= 8 ? "Strong" : password.length >= 6 ? "Medium" : password.length > 0 ? "Weak" : "";
  const strengthColor = passwordStrength === "Strong" ? "bg-green-500" : passwordStrength === "Medium" ? "bg-[#e8c02e]" : "bg-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#288f8a] via-[#225d9c] to-[#288f8a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 bg-[#e8c02e] rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-32 h-32 bg-[#e8c02e] rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative order-2 lg:order-1"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e8c02e] to-[#f0de97] rounded-bl-full opacity-20" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#288f8a] to-[#225d9c] rounded-tr-full opacity-10" />
          
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
            <h2 className="text-[#225d9c] mb-2">Create Your Account</h2>
            <p className="text-muted-foreground mb-6">Join millions of learners worldwide! 🌍</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#225d9c]" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#288f8a] transition-colors h-11"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#225d9c]" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-200 focus:border-[#288f8a] transition-colors h-11"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-gray-200 focus:border-[#288f8a] transition-colors h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#288f8a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: password.length >= 8 ? "100%" : password.length >= 6 ? "66%" : "33%" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{passwordStrength}</span>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#225d9c]" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2 border-gray-200 focus:border-[#288f8a] transition-colors h-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#288f8a] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Passwords match!</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-start gap-2"
            >
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 accent-[#288f8a] mt-1"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{" "}
                <button type="button" className="text-[#225d9c] hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-[#225d9c] hover:underline">
                  Privacy Policy
                </button>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#288f8a] to-[#225d9c] hover:opacity-90 text-white text-lg group"
              >
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Already have an account?</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={onNavigateToLogin}
              variant="outline"
              className="mt-4 w-full h-11 border-2 border-[#225d9c] text-[#225d9c] hover:bg-[#225d9c] hover:text-white transition-colors"
            >
              Login Instead
            </Button>
          </motion.div>
        </motion.div>

        {/* Right side - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white space-y-6 order-1 lg:order-2"
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
            Start Your Journey Today! 🚀
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-white/90"
          >
            Create your free account and unlock amazing features!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4 pt-8"
          >
            {[
              { 
                icon: <Rocket className="w-6 h-6" />, 
                title: "100+ Interactive Lessons",
                desc: "Learn at your own pace",
                color: "from-[#e8c02e] to-[#f0de97]"
              },
              { 
                icon: <Gift className="w-6 h-6" />, 
                title: "Free Certification",
                desc: "Showcase your achievements",
                color: "from-[#225d9c] to-[#288f8a]"
              },
              { 
                icon: <Zap className="w-6 h-6" />, 
                title: "Progress Tracking",
                desc: "Monitor your improvement",
                color: "from-[#288f8a] to-[#225d9c]"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${item.color} p-3 rounded-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mt-8"
          >
            <div className="flex items-center justify-around text-center">
              <div>
                <div className="text-3xl text-white mb-1">1M+</div>
                <div className="text-sm text-white/80">Learners</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <div className="text-3xl text-white mb-1">4.9★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <div className="text-3xl text-white mb-1">100+</div>
                <div className="text-sm text-white/80">Lessons</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}