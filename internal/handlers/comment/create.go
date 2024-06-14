package comment

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		errors.Handle(w, http.StatusBadRequest, "invalid request format", err)
		return
	}

	if comment.Content == "" {
		errors.Handle(w, http.StatusBadRequest, "content cannot be empty", nil)
		return
	}

	if len(comment.Content) > 1000 {
		errors.Handle(w, http.StatusBadRequest, "content exceeds maximum length", nil)
		return
	}

	comment.Id = uuid.New()

	err = h.CommentService.Create(&comment)
	if err != nil {
		errors.Handle(w, http.StatusInternalServerError, "an error occurred while creating the comment", err)
		return
	}

	data := map[string]interface{}{
		"commentId": comment.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
