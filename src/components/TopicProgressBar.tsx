import { Progress } from "./ui/progress";
import { CheckCircle2, BookOpen } from "lucide-react";
import { getTopicProgress } from "../utils/progressTracker";
import { useEffect, useState } from "react";
import React from "react";

interface TopicProgressBarProps {
  topicId: string;
  topicName: string;
  totalLessons: number;
  compact?: boolean;
}

export function TopicProgressBar({ 
  topicId, 
  topicName, 
  totalLessons,
  compact = false 
}: TopicProgressBarProps) {
  const [progress, setProgress] = useState({ completed: 0, total: totalLessons, percentage: 0 });

  useEffect(() => {
    const updateProgress = () => {
      const topicProgress = getTopicProgress(topicId);
      setProgress(topicProgress);
    };

    // Initial load
    updateProgress();

    // Listen for progress updates
    window.addEventListener('progressUpdated', updateProgress);
    
    return () => {
      window.removeEventListener('progressUpdated', updateProgress);
    };
  }, [topicId]);

  const percentage = progress.percentage || 0;
  const completed = progress.completed || 0;
  const total = progress.total || totalLessons;
  const isComplete = percentage === 100;

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{topicName}</span>
          <span className="text-xs font-medium">
            {completed}/{total}
          </span>
        </div>
        <Progress value={percentage} className="h-1.5" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#225d9c]" />
          <span className="font-medium">{topicName}</span>
          {isComplete && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {completed}/{total} lessons
        </span>
      </div>
      <div className="space-y-1">
        <Progress 
          value={percentage} 
          className="h-2"
        />
        <div className="text-xs text-right text-muted-foreground">
          {percentage}% complete
        </div>
      </div>
    </div>
  );
}