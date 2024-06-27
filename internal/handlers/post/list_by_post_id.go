package post

import (
	"encoding/json"
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
)

func (h *Handler) ListByPostId(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/post/")
	if path == "" {
		errors.Handle(w, http.StatusBadRequest, "post ID is required", nil)
		return
	}

	post, err := h.PostService.GetByID(path)
	if err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to fetch post", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(post); err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to encode post to JSON", err)
	}
}
