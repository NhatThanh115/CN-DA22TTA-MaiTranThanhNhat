import { motion } from "motion/react";
import { Button } from "./ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Languages,
  BookOpen,
  Trophy,
  Zap,
  Users,
  ArrowRight
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import React from "react";

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

export function WelcomePage({ onNavigateToLogin, onNavigateToSignUp }: WelcomePageProps) {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t('welcome.features.structured.title'),
      description: t('welcome.features.structured.description'),
      color: "from-[#225d9c] to-[#288f8a]"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: t('welcome.features.progress.title'),
      description: t('welcome.features.progress.description'),
      color: "from-[#e8c02e] to-[#f0de97]"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('welcome.features.interactive.title'),
      description: t('welcome.features.interactive.description'),
      color: "from-[#288f8a] to-[#225d9c]"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Join 1M+ Learners",
      description: "Be part of a global community learning English together",
      color: "from-[#225d9c] to-[#e8c02e]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#225d9c] via-[#288f8a] to-[#225d9c] relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-[#e8c02e] rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-[#e8c02e] rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -60, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full opacity-10 blur-2xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Section */}
      <div className="relative z-10">
        {/* Header */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="bg-[#e8c02e] p-2.5 rounded-xl">
                <Languages className="w-8 h-8 text-[#225d9c]" />
              </div>
              <span className="text-3xl text-white">TVEnglish</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <LanguageSwitcher />
              <Button
                onClick={onNavigateToLogin}
                variant="ghost"
                className="text-white hover:bg-white/20 border border-white/30"
              >
                {t('nav.login')}
              </Button>
              <Button
                onClick={onNavigateToSignUp}
                className="bg-[#e8c02e] text-black hover:opacity-90"
              >
                {t('nav.signup')}
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 flex items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl text-white"
            >
              {t('welcome.subtitle')}
              <span className="block mt-2 text-[#e8c02e]">TVEnglish</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            >
              {t('welcome.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                onClick={onNavigateToSignUp}
                size="lg"
                className="bg-[#e8c02e] text-black hover:opacity-90 h-14 px-8 text-lg group"
              >
                {t('welcome.getStarted')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={onNavigateToLogin}
                size="lg"
                variant="outline"
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[#225d9c] h-14 px-8 text-lg backdrop-blur-sm"
              >
                {t('nav.login')}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-[#225d9c] mb-4">
              {t('welcome.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master English in one platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#225d9c]/30 hover:shadow-xl transition-all group"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl text-[#225d9c] mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Levels Section */}
      <div className="relative z-10 bg-gradient-to-br from-[#225d9c] to-[#288f8a] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-white mb-4">
              Structured Learning Path
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Progress from beginner to advanced with our CEFR-aligned curriculum
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { level: "A1", label: "Beginner", color: "bg-green-500" },
              { level: "A2", label: "Elementary", color: "bg-blue-500" },
              { level: "B1", label: "Intermediate", color: "bg-yellow-500" },
              { level: "B2", label: "Upper Intermediate", color: "bg-orange-500" }
            ].map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className={`${level.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                  <span className="text-xl">{level.level}</span>
                </div>
                <h3 className="text-xl text-white mb-2">{level.label}</h3>
                <p className="text-white/80 text-sm">
                  {level.level === "A1" && "Start with basic vocabulary and simple sentences"}
                  {level.level === "A2" && "Build confidence with everyday conversations"}
                  {level.level === "B1" && "Handle real-world situations independently"}
                  {level.level === "B2" && "Master complex topics and nuanced expressions"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#282a35] text-white/80 py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white mb-3">Top Tutorials</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Vocabulary</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grammar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Speaking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Listening</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Exercises</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quizzes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm">
            <p>&copy; 2025 TVEnglish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
