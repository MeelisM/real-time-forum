package user

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	users, err := h.UserService.GetList()
	if err != nil {
		errors.Handle(w, http.StatusInternalServerError, "failed to fetch users", err)
		return
	}

	response := struct {
		Code int           `json:"code"`
		Data []models.User `json:"data"`
	}{
		Code: http.StatusOK,
		Data: users,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
