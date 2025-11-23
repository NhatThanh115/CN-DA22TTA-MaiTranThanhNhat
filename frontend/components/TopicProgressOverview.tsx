import { Card } from "./ui/card";
import { TopicProgressBar } from "./TopicProgressBar";
import { topics } from "../data/courses";
import { getUserProgress, updateAllTopicProgress } from "../utils/progressTracker";
import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp } from "lucide-react";

export function TopicProgressOverview() {
  const [progress, setProgress] = useState(getUserProgress());

  useEffect(() => {
    // Update all topic progress on mount
    updateAllTopicProgress(topics);
    setProgress(getUserProgress());

    // Listen for progress updates
    const handleProgressUpdate = () => {
      setProgress(getUserProgress());
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
    };
  }, []);

  // Calculate overall progress
  const totalLessons = topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const completedLessons = progress.completedLessons.length;
  const overallPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  const completedTopics = Object.values(progress.topicProgress).filter(
    tp => tp.percentage === 100
  ).length;

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#e6f2ff] to-[#dbeafe] border-2 border-[#225d9c]/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Overall Progress</div>
              <div className="text-3xl text-[#225d9c]">{overallPercentage}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {completedLessons} of {totalLessons} lessons
              </div>
            </div>
            <Target className="w-8 h-8 text-[#225d9c]/60" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#fff9e6] to-[#fef3c7] border-2 border-[#e8c02e]/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Topics Completed</div>
              <div className="text-3xl text-[#d4a017]">{completedTopics}</div>
              <div className="text-xs text-muted-foreground mt-1">
                out of {topics.length} topics
              </div>
            </div>
            <Trophy className="w-8 h-8 text-[#d4a017]/60" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#e6f7f7] to-[#ccfbf1] border-2 border-[#288f8a]/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Study Streak</div>
              <div className="text-3xl text-[#288f8a]">{progress.studyStreak}</div>
              <div className="text-xs text-muted-foreground mt-1">
                days in a row 🔥
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-[#288f8a]/60" />
          </div>
        </Card>
      </div>

      {/* Topic Progress Bars */}
      <Card className="p-6 border-2">
        <div className="mb-6">
          <h2 className="mb-1">📚 Topic Progress</h2>
          <p className="text-sm text-muted-foreground">
            Track your progress through each learning topic
          </p>
        </div>
        
        <div className="space-y-6">
          {topics.map((topic) => (
            <TopicProgressBar
              key={topic.id}
              topicId={topic.id}
              topicName={topic.name}
              totalLessons={topic.lessons.length}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}