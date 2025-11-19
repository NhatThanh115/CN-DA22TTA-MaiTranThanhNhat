import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";
import { Trophy, BookOpen, Mic, Headphones } from "lucide-react";

interface SkillProgress {
  name: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
}

const skills: SkillProgress[] = [
  {
    name: "Vocabulary",
    progress: 75,
    icon: <BookOpen className="w-5 h-5" />,
    color: "#225d9c",
  },
  {
    name: "Grammar",
    progress: 60,
    icon: <BookOpen className="w-5 h-5" />,
    color: "#288f8a",
  },
  {
    name: "Speaking",
    progress: 45,
    icon: <Mic className="w-5 h-5" />,
    color: "#e8c02e",
  },
  {
    name: "Listening",
    progress: 80,
    icon: <Headphones className="w-5 h-5" />,
    color: "#225d9c",
  },
];

export function ProgressTracker() {
  const averageProgress = Math.round(
    skills.reduce((acc, skill) => acc + skill.progress, 0) / skills.length
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3>Your Progress</h3>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground">{averageProgress}% Complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div style={{ color: skill.color }}>{skill.icon}</div>
                <span>{skill.name}</span>
              </div>
              <span className="text-muted-foreground">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">24</div>
              <div className="text-muted-foreground text-sm">Lessons</div>
            </div>
            <div>
              <div className="text-2xl mb-1">156</div>
              <div className="text-muted-foreground text-sm">Words</div>
            </div>
            <div>
              <div className="text-2xl mb-1">7</div>
              <div className="text-muted-foreground text-sm">Days Streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
