package comment

import (
	"encoding/json"
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
)

func (h *Handler) ListByPostId(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	splitPath := strings.Split(path, "/")

	if len(splitPath) < 3 {
		errors.Handle(w, http.StatusBadRequest, "missing postId")
		return
	}

	postId := splitPath[3]
	if postId == "" {
		errors.Handle(w, http.StatusBadRequest, "missing postId")
		return
	}

	comments, err := h.CommentService.GetByID(postId)
	if err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to fetch comments")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(comments); err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to encode comments to JSON")
	}
}
