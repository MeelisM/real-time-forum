package comment

import "01.kood.tech/git/mmumm/real-time-forum.git/internal/services"

type Handler struct {
	CommentService services.CommentService
}

func NewHandler(cs services.CommentService) *Handler {
	return &Handler{CommentService: cs}
}
