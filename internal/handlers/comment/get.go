package comment

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	comments, err := h.CommentService.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(comments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
