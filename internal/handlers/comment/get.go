package comment

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) GetById(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postId")
	if postID == "" {
		http.Error(w, "Missing postId query parameter", http.StatusBadRequest)
		return
	}

	comments, err := h.CommentService.GetByID(postID)
	if err != nil {
		http.Error(w, "Failed to fetch comments: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(comments); err != nil {
		http.Error(w, "Failed to encode comments to JSON: "+err.Error(), http.StatusInternalServerError)
	}
}
