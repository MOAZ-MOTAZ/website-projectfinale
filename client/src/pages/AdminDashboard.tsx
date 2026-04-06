import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading, refetch } = trpc.comments.list.useQuery();
  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: () => {
      setDeletingId(null);
      refetch();
    },
    onError: (error) => {
      alert(`Error deleting comment: ${error.message}`);
      setDeletingId(null);
    },
  });

  // Check if user is admin
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <Button onClick={() => setLocation("/")} style={{ marginTop: "1rem" }}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteComment = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setDeletingId(id);
      await deleteCommentMutation.mutateAsync({ id });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#6B2C3E", margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "#999", margin: "0.5rem 0 0 0" }}>
              Welcome, {user.name || user.email}
            </p>
          </div>
          <Button onClick={() => setLocation("/")} variant="outline">
            Back to Gift
          </Button>
        </div>

        {/* Comments Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#6B2C3E", marginTop: 0 }}>
            Comments ({comments.length})
          </h2>

          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "2rem 0" }}>
              No comments yet. They will appear here once people start leaving messages.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "#F9F7F4",
                    borderRadius: "0.5rem",
                    borderLeft: "4px solid #D4AF37",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontWeight: "600", color: "#6B2C3E" }}>
                        {comment.name}
                      </h3>
                      <span style={{ fontSize: "0.875rem", color: "#999" }}>
                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ margin: "0.5rem 0 0 0", color: "#333", lineHeight: "1.6" }}>
                      {comment.message}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deletingId === comment.id || deleteCommentMutation.isPending}
                    variant="destructive"
                    size="sm"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {deletingId === comment.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}>
            <p style={{ color: "#999", margin: 0, fontSize: "0.875rem" }}>Total Comments</p>
            <p style={{ fontSize: "2rem", fontWeight: "700", color: "#D4AF37", margin: "0.5rem 0 0 0" }}>
              {comments.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
