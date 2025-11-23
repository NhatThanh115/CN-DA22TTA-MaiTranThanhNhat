import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, Flag, ThumbsUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      content: "This lesson was very helpful! The examples made it easy to understand.",
      timestamp: "2 hours ago",
      likes: 12
    },
    {
      id: "2",
      author: "Mike Chen",
      content: "Great explanation. Could you add more practice exercises?",
      timestamp: "1 day ago",
      likes: 8
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        content: newComment,
        timestamp: "Just now",
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully!");
    }
  };

  const handleReportLesson = () => {
    if (reportReason.trim()) {
      toast.success("Thank you for your feedback! We'll review this lesson.");
      setReportReason("");
      setShowReportDialog(false);
    }
  };

  const handleLike = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments & Feedback
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReportDialog(!showReportDialog)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Flag className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <Card className="p-4 border-2 border-red-300 bg-red-50">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-red-900 mb-1">Report a Problem</h4>
              <p className="text-red-700 text-sm">Let us know if you found a mistake or issue with this lesson</p>
            </div>
          </div>
          <Textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue you found..."
            className="mb-3 bg-white"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleReportLesson}
              size="sm"
              className="bg-[#288f8a] hover:bg-[#236f6b] text-white"
            >
              Submit Report
            </Button>
            <Button
              onClick={() => setShowReportDialog(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Add Comment */}
      <Card className="p-4 border-2">
        <h4 className="mb-3">Leave a Comment</h4>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this lesson..."
          className="mb-3"
          rows={3}
        />
        <Button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="bg-[#288f8a] hover:bg-[#236f6b] text-white"
        >
          Post Comment
        </Button>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h4>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h4>
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-[#225d9c] text-white">
                  {comment.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm mb-3">{comment.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                  className="h-8 px-2 text-muted-foreground hover:text-primary"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
