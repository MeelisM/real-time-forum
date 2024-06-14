package post

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
)

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	posts, err := h.PostService.GetAll()
	if err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to fetch posts", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to encode posts to JSON", err)
	}
}
