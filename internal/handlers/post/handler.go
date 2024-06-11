package post

import (
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/services"
)

type Handler struct {
	PostService services.PostService
}

func NewHandler(ps services.PostService) *Handler {
	return &Handler{PostService: ps}
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.Create(w, r)
	case http.MethodGet:
		h.GetAll(w, r)
	default:
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
