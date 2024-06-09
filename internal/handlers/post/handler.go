package post

import "01.kood.tech/git/mmumm/real-time-forum.git/internal/services"

type Handler struct {
	PostService services.PostService
}

func NewHandler(ps services.PostService) *Handler {
	return &Handler{PostService: ps}
}
