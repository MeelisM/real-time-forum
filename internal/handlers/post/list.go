package post

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	posts, err := h.PostService.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
