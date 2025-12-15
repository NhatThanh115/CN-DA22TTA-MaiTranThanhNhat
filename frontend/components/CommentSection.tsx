import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, Flag, ThumbsUp, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  lesson_id: string;
  author_name: string;
  content: string;
  created_at: string;
  likes_count: number;
  has_liked?: boolean;
}

interface CommentSectionProps {
  lessonId?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function getCurrentUserId(): string | null {
  const userStr = localStorage.getItem("tvenglish_user_profile");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  }
  return null;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export function CommentSection({ lessonId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = getCurrentUserId();
  const isLoggedIn = !!getAuthToken();

  // Fetch comments when lessonId changes
  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);

  const fetchComments = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/comments/${lessonId}`, {
        headers,
      });

      const result = await response.json();
      if (result.success && result.data) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !lessonId) return;

    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to post a comment");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          content: newComment.trim(),
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setComments([result.data, ...comments]);
        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportLesson = () => {
    if (reportReason.trim()) {
      toast.success("Thank you for your feedback! We'll review this lesson.");
      setReportReason("");
      setShowReportDialog(false);
    }
  };

  const handleLike = async (commentId: string) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to like comments");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success && result.data) {
        setComments(comments.map(comment =>
          comment.id === commentId
            ? { 
                ...comment, 
                likes_count: result.data.likes_count,
                has_liked: result.data.liked 
              }
            : comment
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async (commentId: string) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success("Comment deleted");
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
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
          placeholder={isLoggedIn ? "Share your thoughts about this lesson..." : "Please log in to leave a comment"}
          className="mb-3"
          rows={3}
          disabled={!isLoggedIn}
        />
        <Button
          onClick={handleAddComment}
          disabled={!newComment.trim() || submitting || !isLoggedIn}
          className="bg-[#288f8a] hover:bg-[#236f6b] text-white"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h4>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h4>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#225d9c] text-white">
                    {comment.author_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author_name || "Anonymous"}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                      className={`h-8 px-2 ${
                        comment.has_liked 
                          ? "text-primary" 
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-1 ${comment.has_liked ? "fill-current" : ""}`} />
                      {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                    </Button>
                    {currentUserId && comment.user_id === currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="h-8 px-2 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
