import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { courses, topics, type Course } from "../data/courses";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Video,
  Music,
  GripVertical,
  Save,
  X
} from "lucide-react";
import React from 'react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  type: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing';
  content: string;
  videoUrl?: string;
  audioUrl?: string;
  exercises: Exercise[];
  order: number;
  status: 'draft' | 'published';
  courseId?: string; // Added course assignment
  topicId?: string;  // Added topic assignment
  createdAt: string;
  updatedAt: string;
}

interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ContentManagementProps {
  currentUser: { username: string; email?: string; role?: string };
  onNavigate?: (view: string) => void;
}

export function ContentManagement({ currentUser, onNavigate }: ContentManagementProps) {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [currentLessonForExercise, setCurrentLessonForExercise] = useState<string | null>(null);
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'A1' as 'A1' | 'A2' | 'B1' | 'B2',
    type: 'grammar' as Lesson['type'],
    content: '',
    videoUrl: '',
    audioUrl: '',
    courseId: '',
    topicId: '',
    status: 'draft' as 'draft' | 'published'
  });

  // New topic form data
  const [newTopicData, setNewTopicData] = useState({
    name: '',
    description: '',
    icon: '📚'
  });

  // Get available topics based on selected course
  const availableTopics = formData.courseId
    ? topics.filter(topic => {
        const course = courses.find(c => c.id === formData.courseId);
        return course?.topics.some(t => t.id === topic.id);
      })
    : [];

  const [exerciseFormData, setExerciseFormData] = useState({
    type: 'multiple-choice' as Exercise['type'],
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  // Load lessons from localStorage
  useEffect(() => {
    const storedLessons = localStorage.getItem('adminLessons');
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, []);

  // Save lessons to localStorage
  const saveLessons = (updatedLessons: Lesson[]) => {
    setLessons(updatedLessons);
    localStorage.setItem('adminLessons', JSON.stringify(updatedLessons));
  };

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by course difficulty instead of lesson difficulty
    let matchesDifficulty = difficultyFilter === "all";
    if (!matchesDifficulty && lesson.courseId) {
      const course = courses.find(c => c.id === lesson.courseId);
      matchesDifficulty = course?.level === difficultyFilter;
    }
    
    const matchesType = typeFilter === "all" || lesson.type === typeFilter;
    return matchesSearch && matchesDifficulty && matchesType;
  });

  // Create or update lesson
  const handleSaveLesson = () => {
    if (!formData.title || !formData.description || !formData.content) {
      toast.error(t('admin.content.requiredFields'));
      return;
    }

    if (editingLesson) {
      // Update existing lesson
      const updatedLessons = lessons.map(lesson => 
        lesson.id === editingLesson.id 
          ? { ...lesson, ...formData, updatedAt: new Date().toISOString() }
          : lesson
      );
      saveLessons(updatedLessons);
      toast.success(t('admin.content.lessonUpdated'));
    } else {
      // Create new lesson
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        ...formData,
        exercises: [],
        order: lessons.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveLessons([...lessons, newLesson]);
      toast.success(t('admin.content.lessonCreated'));
    }

    resetForm();
    setShowLessonDialog(false);
  };

  // Delete lesson
  const handleDeleteLesson = (lessonId: string) => {
    if (confirm(t('admin.content.confirmDelete'))) {
      const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
      saveLessons(updatedLessons);
      toast.success(t('admin.content.lessonDeleted'));
    }
  };

  // Save exercise
  const handleSaveExercise = () => {
    if (!exerciseFormData.question || !exerciseFormData.correctAnswer) {
      toast.error(t('admin.content.exerciseRequiredFields'));
      return;
    }

    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === currentLessonForExercise) {
        const exercises = editingExercise
          ? lesson.exercises.map(ex => ex.id === editingExercise.id ? { ...ex, ...exerciseFormData } : ex)
          : [...lesson.exercises, { id: `ex-${Date.now()}`, ...exerciseFormData }];
        
        return { ...lesson, exercises, updatedAt: new Date().toISOString() };
      }
      return lesson;
    });

    saveLessons(updatedLessons);
    toast.success(editingExercise ? t('admin.content.exerciseUpdated') : t('admin.content.exerciseCreated'));
    resetExerciseForm();
    setShowExerciseDialog(false);
  };

  // Delete exercise
  const handleDeleteExercise = (lessonId: string, exerciseId: string) => {
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          exercises: lesson.exercises.filter(ex => ex.id !== exerciseId),
          updatedAt: new Date().toISOString()
        };
      }
      return lesson;
    });
    saveLessons(updatedLessons);
    toast.success(t('admin.content.exerciseDeleted'));
  };

  // Reset forms
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'A1',
      type: 'grammar',
      content: '',
      videoUrl: '',
      audioUrl: '',
      courseId: '',
      topicId: '',
      status: 'draft'
    });
    setEditingLesson(null);
  };

  const resetExerciseForm = () => {
    setExerciseFormData({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    });
    setEditingExercise(null);
    setCurrentLessonForExercise(null);
  };

  // Open edit dialog
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      type: lesson.type,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      audioUrl: lesson.audioUrl || '',
      courseId: lesson.courseId || '',
      topicId: lesson.topicId || '',
      status: lesson.status
    });
    setShowLessonDialog(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return 'bg-green-100 text-green-700 border-green-300';
      case 'A2': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B1': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'B2': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl mb-1">{t('admin.content.lessonManagement')}</h2>
          <p className="text-gray-600">{t('admin.content.lessonManagementDesc')}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => onNavigate?.('create-topic')}
            className="bg-[#288f8a] hover:bg-[#1f7a73] border-2 border-[#288f8a]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Topic
          </Button>
          <Button
            onClick={() => onNavigate?.('create-lesson')}
            className="bg-[#225d9c] hover:bg-[#1a4a7a] border-2 border-[#225d9c]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.content.createLesson')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('admin.content.searchLessons')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.content.filterByDifficulty')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.content.allDifficulties')}</SelectItem>
              <SelectItem value="A1">A1</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
              <SelectItem value="B1">B1</SelectItem>
              <SelectItem value="B2">B2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.content.filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.content.allTypes')}</SelectItem>
              <SelectItem value="grammar">{t('admin.content.types.grammar')}</SelectItem>
              <SelectItem value="vocabulary">{t('admin.content.types.vocabulary')}</SelectItem>
              <SelectItem value="listening">{t('admin.content.types.listening')}</SelectItem>
              <SelectItem value="speaking">{t('admin.content.types.speaking')}</SelectItem>
              <SelectItem value="reading">{t('admin.content.types.reading')}</SelectItem>
              <SelectItem value="writing">{t('admin.content.types.writing')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 border-2 border-[#225d9c]">
          <div className="text-sm text-gray-600 mb-1">{t('admin.content.totalLessons')}</div>
          <div className="text-3xl">{lessons.length}</div>
        </Card>
        <Card className="p-6 border-2 border-green-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.content.published')}</div>
          <div className="text-3xl text-green-600">{lessons.filter(l => l.status === 'published').length}</div>
        </Card>
        <Card className="p-6 border-2 border-gray-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.content.drafts')}</div>
          <div className="text-3xl text-gray-600">{lessons.filter(l => l.status === 'draft').length}</div>
        </Card>
        <Card className="p-6 border-2 border-[#288f8a]">
          <div className="text-sm text-gray-600 mb-1">{t('admin.content.exercises')}</div>
          <div className="text-3xl text-[#288f8a]">{lessons.reduce((sum, l) => sum + l.exercises.length, 0)}</div>
        </Card>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLessons.map((lesson) => {
          // Get course and topic info
          const lessonCourse = courses.find(c => c.id === lesson.courseId);
          const lessonTopic = topics.find(t => t.id === lesson.topicId);
          
          return (
          <Card key={lesson.id} className="p-6 border-2 border-gray-200 hover:border-[#225d9c] transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl">{lesson.title}</h3>
                      {lessonCourse && (
                        <Badge className={`border ${getDifficultyColor(lessonCourse.level)}`}>
                          {lessonCourse.level}
                        </Badge>
                      )}
                      <Badge className={`border ${getStatusColor(lesson.status)}`}>
                        {t(`admin.content.${lesson.status}`)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{lesson.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {lessonCourse && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {lessonCourse.title}
                        </span>
                      )}
                      {lessonTopic && (
                        <span>
                          {lessonTopic.icon} {lessonTopic.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {t(`admin.content.types.${lesson.type}`)}
                      </span>
                      {lesson.videoUrl && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {t('admin.content.hasVideo')}
                        </span>
                      )}
                      {lesson.audioUrl && (
                        <span className="flex items-center gap-1">
                          <Music className="w-4 h-4" />
                          {t('admin.content.hasAudio')}
                        </span>
                      )}
                      <span>{lesson.exercises.length} {t('admin.content.exercises')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentLessonForExercise(lesson.id);
                    resetExerciseForm();
                    setShowExerciseDialog(true);
                  }}
                  className="border-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t('admin.content.addExercise')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditLesson(lesson)}
                  className="border-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="border-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Exercises List */}
            {lesson.exercises.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <h4 className="text-sm text-gray-600 mb-3">{t('admin.content.exercises')}:</h4>
                <div className="space-y-2">
                  {lesson.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border-2 border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="border bg-white text-gray-700 border-gray-300">
                            {t(`admin.content.exerciseTypes.${exercise.type}`)}
                          </Badge>
                          <span className="text-sm">{exercise.question}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentLessonForExercise(lesson.id);
                            setEditingExercise(exercise);
                            setExerciseFormData({
                              type: exercise.type,
                              question: exercise.question,
                              options: exercise.options || ['', '', '', ''],
                              correctAnswer: exercise.correctAnswer,
                              explanation: exercise.explanation || ''
                            });
                            setShowExerciseDialog(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExercise(lesson.id, exercise.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          );
        })}
      </div>

      {/* Create/Edit Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="border-2 border-[#225d9c] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#225d9c]" />
              {editingLesson ? t('admin.content.editLesson') : t('admin.content.createLesson')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.content.lessonFormDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t('admin.content.lessonTitle')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-2"
                placeholder={t('admin.content.lessonTitlePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="description">{t('admin.content.description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-2"
                rows={3}
                placeholder={t('admin.content.descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('admin.content.course')}</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value, topicId: '' })}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder={t('admin.content.selectCourse')} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('admin.content.type')}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Lesson['type']) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">{t('admin.content.types.grammar')}</SelectItem>
                    <SelectItem value="vocabulary">{t('admin.content.types.vocabulary')}</SelectItem>
                    <SelectItem value="listening">{t('admin.content.types.listening')}</SelectItem>
                    <SelectItem value="speaking">{t('admin.content.types.speaking')}</SelectItem>
                    <SelectItem value="reading">{t('admin.content.types.reading')}</SelectItem>
                    <SelectItem value="writing">{t('admin.content.types.writing')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topic Section */}
            <div className="space-y-4 p-4 border-2 border-[#288f8a] rounded-lg bg-[#288f8a]/5">
              <div className="flex items-center justify-between">
                <Label className="text-base">{t('admin.content.topicSection')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreatingNewTopic(!isCreatingNewTopic);
                    if (!isCreatingNewTopic) {
                      setFormData({ ...formData, topicId: '' });
                    } else {
                      setNewTopicData({ name: '', description: '', icon: '📚' });
                    }
                  }}
                  className="border-2"
                  disabled={!formData.courseId}
                >
                  {isCreatingNewTopic ? t('admin.content.selectExistingTopic') : t('admin.content.createNewTopic')}
                </Button>
              </div>

              {!formData.courseId && (
                <p className="text-sm text-gray-500 italic">
                  {t('admin.content.selectCourseFirst')}
                </p>
              )}

              {formData.courseId && !isCreatingNewTopic && (
                <div>
                  <Label>{t('admin.content.existingTopic')}</Label>
                  <Select
                    value={formData.topicId}
                    onValueChange={(value) => setFormData({ ...formData, topicId: value })}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue placeholder={t('admin.content.selectTopic')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.icon} {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.courseId && isCreatingNewTopic && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="topicName">{t('admin.content.topicName')} *</Label>
                    <Input
                      id="topicName"
                      value={newTopicData.name}
                      onChange={(e) => setNewTopicData({ ...newTopicData, name: e.target.value })}
                      className="border-2"
                      placeholder={t('admin.content.topicNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topicDescription">{t('admin.content.topicDescription')} *</Label>
                    <Textarea
                      id="topicDescription"
                      value={newTopicData.description}
                      onChange={(e) => setNewTopicData({ ...newTopicData, description: e.target.value })}
                      className="border-2"
                      rows={2}
                      placeholder={t('admin.content.topicDescriptionPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topicIcon">{t('admin.content.topicIcon')}</Label>
                    <Input
                      id="topicIcon"
                      value={newTopicData.icon}
                      onChange={(e) => setNewTopicData({ ...newTopicData, icon: e.target.value })}
                      className="border-2"
                      placeholder="📚"
                      maxLength={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('admin.content.topicIconHint')}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">{t('admin.content.lessonContent')} *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="border-2"
                rows={6}
                placeholder={t('admin.content.contentPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="videoUrl">{t('admin.content.videoUrl')}</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="border-2"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <Label htmlFor="audioUrl">{t('admin.content.audioUrl')}</Label>
                <Input
                  id="audioUrl"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="border-2"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label>{t('admin.content.status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('admin.content.draft')}</SelectItem>
                  <SelectItem value="published">{t('admin.content.published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLessonDialog(false)} className="border-2">
              <X className="w-4 h-4 mr-2" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveLesson} className="bg-[#225d9c] hover:bg-[#1a4a7a] border-2 border-[#225d9c]">
              <Save className="w-4 h-4 mr-2" />
              {editingLesson ? t('common.save') : t('admin.content.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Exercise Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="border-2 border-[#288f8a] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#288f8a]" />
              {editingExercise ? t('admin.content.editExercise') : t('admin.content.addExercise')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.content.exerciseFormDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t('admin.content.exerciseType')}</Label>
              <Select
                value={exerciseFormData.type}
                onValueChange={(value: Exercise['type']) => setExerciseFormData({ ...exerciseFormData, type: value })}
              >
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">{t('admin.content.exerciseTypes.multiple-choice')}</SelectItem>
                  <SelectItem value="fill-blank">{t('admin.content.exerciseTypes.fill-blank')}</SelectItem>
                  <SelectItem value="true-false">{t('admin.content.exerciseTypes.true-false')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question">{t('admin.content.question')} *</Label>
              <Textarea
                id="question"
                value={exerciseFormData.question}
                onChange={(e) => setExerciseFormData({ ...exerciseFormData, question: e.target.value })}
                className="border-2"
                rows={3}
                placeholder={t('admin.content.questionPlaceholder')}
              />
            </div>

            {exerciseFormData.type === 'multiple-choice' && (
              <div>
                <Label>{t('admin.content.options')}</Label>
                {exerciseFormData.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...exerciseFormData.options];
                      newOptions[index] = e.target.value;
                      setExerciseFormData({ ...exerciseFormData, options: newOptions });
                    }}
                    className="border-2 mb-2"
                    placeholder={`${t('admin.content.option')} ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="correctAnswer">{t('admin.content.correctAnswer')} *</Label>
              <Input
                id="correctAnswer"
                value={exerciseFormData.correctAnswer}
                onChange={(e) => setExerciseFormData({ ...exerciseFormData, correctAnswer: e.target.value })}
                className="border-2"
                placeholder={t('admin.content.correctAnswerPlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="explanation">{t('admin.content.explanation')}</Label>
              <Textarea
                id="explanation"
                value={exerciseFormData.explanation}
                onChange={(e) => setExerciseFormData({ ...exerciseFormData, explanation: e.target.value })}
                className="border-2"
                rows={2}
                placeholder={t('admin.content.explanationPlaceholder')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExerciseDialog(false)} className="border-2">
              <X className="w-4 h-4 mr-2" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveExercise} className="bg-[#288f8a] hover:bg-[#1f7a73] border-2 border-[#288f8a]">
              <Save className="w-4 h-4 mr-2" />
              {editingExercise ? t('common.save') : t('admin.content.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}