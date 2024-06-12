package comment

import (
	"encoding/json"
	"fmt"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, fmt.Sprintf("invalid request format: %v", err))
		return
	}

	// Validate content
	if comment.Content == "" {
		utils.HandleError(w, http.StatusBadRequest, "content cannot be empty")
		return
	}

	if len(comment.Content) > 1000 {
		utils.HandleError(w, http.StatusBadRequest, "content exceeds maximum length")
		return
	}

	// Generate new UUID for the comment
	comment.Id = uuid.New()

	err = h.CommentService.Create(&comment)
	if err != nil {
		utils.HandleError(w, http.StatusInternalServerError, "failed to create comment")
		return
	}

	data := map[string]interface{}{
		"commentId": comment.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
