package user

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var loginRequest models.LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		errors.Handle(w, http.StatusBadRequest, "invalid request format", err)
		return
	}

	user, token, err := h.UserService.ValidateLogin(loginRequest.UsernameOrEmail, loginRequest.Password)
	if err != nil {
		errors.Handle(w, http.StatusUnauthorized, "invalid login credentials", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"id": "` + user.Id.String() + `", "token": "` + token + `", "message": "Logged in"}`))
}
