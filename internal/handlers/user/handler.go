package user

import "01.kood.tech/git/mmumm/real-time-forum.git/internal/services"

type Handler struct {
	UserService services.UserService
}

func NewHandler(us services.UserService) *Handler {
	return &Handler{UserService: us}
}
