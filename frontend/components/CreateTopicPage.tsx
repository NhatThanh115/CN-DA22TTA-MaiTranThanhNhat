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
  FolderOpen,
  Lightbulb
} from 'lucide-react';
import React from 'react';

interface CreateTopicPageProps {
  onNavigate: (view: string) => void;
  editingTopicId?: string;
}

export function CreateTopicPage({ onNavigate, editingTopicId }: CreateTopicPageProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    courseId: '',
    estimatedHours: 5,
    color: '#225d9c'
  });

  // Icon suggestions
const iconSuggestions = [
  '📚', '🎯', '💬', '🗣️', '📖', '✏️', 
  '🎓', '📝', '📤', '🗨️', '🎭', '🎪',
  '🌍', '🏠', '🍕', '⏰', '🔢', '📅'
];

// Color suggestions
const colorSuggestions = [
  '#225d9c', // Blue (primary)
  '#288f8a', // Teal (secondary)
  '#e8c02e', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Bright Blue
  '#f97316', // Orange
  '#a855f7', // Purple
  '#ec4899'  // Pink
];

  // Load topic data if editing
  useEffect(() => {
    if (editingTopicId) {
      const storedTopics = localStorage.getItem('adminTopics');
      if (storedTopics) {
        const topics = JSON.parse(storedTopics);
        const topicToEdit = topics.find((t: any) => t.id === editingTopicId);
        if (topicToEdit) {
          setFormData({
            name: topicToEdit.name || '',
            description: topicToEdit.description || '',
            icon: topicToEdit.icon || '📚',
            courseId: topicToEdit.courseId || '',
            estimatedHours: topicToEdit.estimatedHours || 5,
            color: topicToEdit.color || '#225d9c'
          });
        }
      }
    }
  }, [editingTopicId]);

  // Save topic
  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a topic name');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a topic description');
      return;
    }
    if (!formData.courseId) {
      toast.error('Please select a course');
      return;
    }
    if (formData.estimatedHours <= 0) {
      toast.error('Estimated hours must be greater than 0');
      return;
    }

    // Prepare topic object
    const topic = {
      id: editingTopicId || `topic-${Date.now()}`,
      ...formData,
      lessons: [], // Topics start with no lessons
      createdAt: editingTopicId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const storedTopics = localStorage.getItem('adminTopics');
    let topics = storedTopics ? JSON.parse(storedTopics) : [];

    if (editingTopicId) {
      // Update existing topic
      topics = topics.map((t: any) => t.id === editingTopicId ? topic : t);
      toast.success('Topic updated successfully!');
    } else {
      // Add new topic
      topics.push(topic);
      toast.success('Topic created successfully!');
    }

    localStorage.setItem('adminTopics', JSON.stringify(topics));

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
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onNavigate('admin')}
            className="text-white hover:bg-white/20 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8" />
            <h1 className="text-3xl">
              {editingTopicId ? 'Edit Topic' : 'Create New Topic'}
            </h1>
          </div>
          <p className="text-white/90">
            Fill in the form below to {editingTopicId ? 'update' : 'create'} a topic
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Basic Information */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">1</span>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Topic Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2"
                placeholder="e.g., Basic Greetings & Introductions"
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
                placeholder="Brief description of what this topic covers"
              />
            </div>

            <div>
              <Label>Course / CEFR Level *</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
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
              <Label htmlFor="estimatedHours">Estimated Hours *</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="1"
                max="100"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                className="border-2"
                placeholder="e.g., 5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Estimated time in hours to complete this topic
              </p>
            </div>
          </div>
        </Card>

        {/* Visual Customization */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">2</span>
            Visual Customization
          </h2>
          <div className="space-y-6">
            {/* Icon */}
            <div>
              <Label htmlFor="icon">Topic Icon</Label>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-4xl bg-white">
                  {formData.icon}
                </div>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="border-2 flex-1"
                  placeholder="📚"
                  maxLength={2}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Quick select:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '8px' }}>
                {iconSuggestions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-2xl hover:border-[#225d9c] hover:bg-blue-50 transition-colors ${
                      formData.icon === icon ? 'border-[#225d9c] bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Choose an emoji that represents this topic
              </p>
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="color">Topic Color</Label>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-16 h-16 border-2 border-gray-300 rounded-lg"
                  style={{ backgroundColor: formData.color }}
                />
                <Input
                  id="color"
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="border-2 flex-1"
                  placeholder="#225d9c"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Quick select:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                {colorSuggestions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 border-2 rounded-lg hover:scale-110 transition-transform ${
                      formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Color will be used for the topic card and accents
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 border-2 border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#225d9c] text-white rounded-full flex items-center justify-center">3</span>
            Preview
          </h2>
          <p className="text-sm text-gray-600 mb-4">This is how your topic will appear in the course</p>
          
          {/* Topic Card Preview */}
          <Card 
            className="border-2 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            style={{ borderColor: formData.color }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2" style={{ color: formData.color }}>
                  {formData.name || 'Topic Name'}
                </h3>
                <p className="text-gray-600 mb-3">
                  {formData.description || 'Topic description will appear here'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>⏱️ {formData.estimatedHours} hours</span>
                  <span>📚 0 lessons</span>
                </div>
              </div>
            </div>
          </Card>
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
            {editingTopicId ? 'Update Topic' : 'Create Topic'}
          </Button>
        </div>
      </div>
    </div>
  );
}
