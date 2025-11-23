import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { courses } from '../data/courses';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import {
  ArrowLeft,
  Save,
  BookOpen,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';
import React from 'react';

interface Example {
  id: string;
  sentence: string;
  explanation: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CreateLessonPageProps {
  onNavigate: (view: string) => void;
  editingLessonId?: string;
}

export function CreateLessonPage({ onNavigate, editingLessonId }: CreateLessonPageProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    topicId: '',
    difficulty: 'A1' as 'A1' | 'A2' | 'B1' | 'B2',
    type: 'grammar' as 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing',
    status: 'draft' as 'draft' | 'published'
  });

  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [examples, setExamples] = useState<Example[]>([
    { id: '1', sentence: '', explanation: '' }
  ]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  // Get available topics based on selected course
  const availableTopics = formData.courseId
    ? courses.find(c => c.id === formData.courseId)?.topics || []
    : [];

  // Load lesson data if editing
  useEffect(() => {
    if (editingLessonId) {
      const storedLessons = localStorage.getItem('adminLessons');
      if (storedLessons) {
        const lessons = JSON.parse(storedLessons);
        const lessonToEdit = lessons.find((l: any) => l.id === editingLessonId);
        if (lessonToEdit) {
          setFormData({
            title: lessonToEdit.title || '',
            description: lessonToEdit.description || '',
            courseId: lessonToEdit.courseId || '',
            topicId: lessonToEdit.topicId || '',
            difficulty: lessonToEdit.difficulty || 'A1',
            type: lessonToEdit.type || 'grammar',
            status: lessonToEdit.status || 'draft'
          });
          setKeyPoints(lessonToEdit.keyPoints || ['']);
          setExamples(lessonToEdit.examples || [{ id: '1', sentence: '', explanation: '' }]);
          setMedia(lessonToEdit.media || []);
          if (lessonToEdit.practiceExercise) {
            setQuiz(lessonToEdit.practiceExercise);
          }
        }
      }
    }
  }, [editingLessonId]);

  // Key Points handlers
  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const updateKeyPoint = (index: number, value: string) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
  };

  const removeKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  // Examples handlers
  const addExample = () => {
    setExamples([...examples, { id: Date.now().toString(), sentence: '', explanation: '' }]);
  };

  const updateExample = (id: string, field: 'sentence' | 'explanation', value: string) => {
    setExamples(examples.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExample = (id: string) => {
    setExamples(examples.filter(ex => ex.id !== id));
  };

  // Media handlers
  const addMedia = () => {
    setMedia([...media, { id: Date.now().toString(), type: 'image', url: '', caption: '' }]);
  };

  const updateMedia = (id: string, field: keyof MediaItem, value: string) => {
    setMedia(media.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  // Quiz handlers
  const updateQuizOption = (index: number, value: string) => {
    const updated = [...quiz.options];
    updated[index] = value;
    setQuiz({ ...quiz, options: updated });
  };

  // Save lesson
  const handleSave = () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a lesson title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a lesson description');
      return;
    }
    if (!formData.courseId) {
      toast.error('Please select a course');
      return;
    }
    if (!formData.topicId) {
      toast.error('Please select a topic');
      return;
    }

    // Filter out empty key points
    const filteredKeyPoints = keyPoints.filter(kp => kp.trim() !== '');
    if (filteredKeyPoints.length === 0) {
      toast.error('Please add at least one key point');
      return;
    }

    // Filter out empty examples
    const filteredExamples = examples.filter(ex => ex.sentence.trim() !== '' && ex.explanation.trim() !== '');
    if (filteredExamples.length === 0) {
      toast.error('Please add at least one example');
      return;
    }

    // Prepare lesson object
    const lesson = {
      id: editingLessonId || `lesson-${Date.now()}`,
      ...formData,
      keyPoints: filteredKeyPoints,
      examples: filteredExamples,
      media: media.filter(m => m.url.trim() !== ''),
      practiceExercise: quiz.question.trim() !== '' ? quiz : undefined,
      createdAt: editingLessonId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const storedLessons = localStorage.getItem('adminLessons');
    let lessons = storedLessons ? JSON.parse(storedLessons) : [];

    if (editingLessonId) {
      // Update existing lesson
      lessons = lessons.map((l: any) => l.id === editingLessonId ? lesson : l);
      toast.success('Lesson updated successfully!');
    } else {
      // Add new lesson
      lessons.push(lesson);
      toast.success('Lesson created successfully!');
    }

    localStorage.setItem('adminLessons', JSON.stringify(lessons));

    // Navigate back to admin
    onNavigate('admin');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return 'bg-green-100 text-green-700 border-green-300';
      case 'A2': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B1': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'B2': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#225d9c] to-[#288f8a] text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onNavigate('admin')}
            className="text-white hover:bg-white/20 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl">
              {editingLessonId ? 'Edit Lesson' : 'Create New Lesson'}
            </h1>
          </div>
          <p className="text-white/90">
            Fill in the form below to {editingLessonId ? 'update' : 'create'} a lesson
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Basic Information */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">1</span>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-2"
                placeholder="e.g., Present Simple Tense"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-2"
                rows={3}
                placeholder="Brief description of what students will learn in this lesson"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Course / CEFR Level *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value, topicId: '' })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center gap-2">
                          <Badge className={`border ${getDifficultyColor(course.level)}`}>
                            {course.level}
                          </Badge>
                          {course.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Topic *</Label>
                <Select
                  value={formData.topicId}
                  onValueChange={(value) => setFormData({ ...formData, topicId: value })}
                  disabled={!formData.courseId}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.icon} {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.courseId && (
                  <p className="text-xs text-gray-500 mt-1">Select a course first</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Lesson Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Points */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">2</span>
            Key Points *
          </h2>
          <p className="text-sm text-gray-600 mb-4">Add the main learning points for this lesson</p>
          <div className="space-y-3">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <Input
                  value={point}
                  onChange={(e) => updateKeyPoint(index, e.target.value)}
                  className="border-2 flex-1"
                  placeholder={`Key point ${index + 1}`}
                />
                {keyPoints.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeKeyPoint(index)}
                    className="border-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addKeyPoint}
            className="mt-4 border-2 border-[#288f8a] text-[#288f8a] hover:bg-[#288f8a] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Key Point
          </Button>
        </Card>

        {/* Examples */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">3</span>
            Examples *
          </h2>
          <p className="text-sm text-gray-600 mb-4">Provide examples with explanations</p>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <Card key={example.id} className="p-4 border-2 border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Example {index + 1}</span>
                  {examples.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExample(example.id)}
                      className="text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Sentence</Label>
                    <Input
                      value={example.sentence}
                      onChange={(e) => updateExample(example.id, 'sentence', e.target.value)}
                      className="border-2"
                      placeholder="e.g., I go to school every day."
                    />
                  </div>
                  <div>
                    <Label>Explanation</Label>
                    <Textarea
                      value={example.explanation}
                      onChange={(e) => updateExample(example.id, 'explanation', e.target.value)}
                      className="border-2"
                      rows={2}
                      placeholder="e.g., This sentence uses the present simple tense to describe a daily routine."
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addExample}
            className="mt-4 border-2 border-[#288f8a] text-[#288f8a] hover:bg-[#288f8a] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Example
          </Button>
        </Card>

        {/* Media (Optional) */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">4</span>
            Media (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">Add images or videos to support the lesson</p>
          {media.length > 0 && (
            <div className="space-y-4 mb-4">
              {media.map((item, index) => (
                <Card key={item.id} className="p-4 border-2 border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Media {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(item.id)}
                      className="text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value: 'image' | 'video') => updateMedia(item.id, 'type', value)}
                      >
                        <SelectTrigger className="border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={item.url}
                        onChange={(e) => updateMedia(item.id, 'url', e.target.value)}
                        className="border-2"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Caption</Label>
                      <Input
                        value={item.caption}
                        onChange={(e) => updateMedia(item.id, 'caption', e.target.value)}
                        className="border-2"
                        placeholder="Describe the media"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            onClick={addMedia}
            className="border-2 border-[#288f8a] text-[#288f8a] hover:bg-[#288f8a] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </Card>

        {/* Practice Quiz (Optional) */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">5</span>
            Practice Quiz (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">Add a multiple-choice quiz to test understanding</p>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={quiz.question}
                onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
                className="border-2"
                placeholder="e.g., Which sentence is in present simple tense?"
              />
            </div>

            <div className="space-y-2">
              <Label>Answer Options</Label>
              {quiz.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                  <Input
                    value={option}
                    onChange={(e) => updateQuizOption(index, e.target.value)}
                    className="border-2 flex-1"
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={quiz.correctAnswer === index}
                    onChange={() => setQuiz({ ...quiz, correctAnswer: index })}
                    className="w-5 h-5 text-[#288f8a]"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500">Select the correct answer with the radio button</p>
            </div>

            <div>
              <Label>Explanation</Label>
              <Textarea
                value={quiz.explanation}
                onChange={(e) => setQuiz({ ...quiz, explanation: e.target.value })}
                className="border-2"
                rows={2}
                placeholder="Explain why this is the correct answer"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
          <Button
            variant="outline"
            onClick={() => onNavigate('admin')}
            className="border-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#288f8a] hover:bg-[#236f6b] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingLessonId ? 'Update Lesson' : 'Create Lesson'}
          </Button>
        </div>
      </div>
    </div>
  );
}
