package chat

import (
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/services"
)

type Handler struct {
	ChatService services.ChatService
}

func NewHandler(cs services.ChatService) *Handler {
	return &Handler{ChatService: cs}
}
