package user

import (
	"encoding/json"
	"fmt"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errors.Handle(w, http.StatusBadRequest, fmt.Sprintf("invalid request format: %v", err))
		return
	}

	userFromDB, token, err := h.UserService.Validate(user.Username, user.Email)
	if err != nil {
		errors.Handle(w, http.StatusBadRequest, "invalid login credentials")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userFromDB.Password), []byte(user.Password))
	if err != nil {
		errors.Handle(w, http.StatusUnauthorized, "invalid login credentials")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"id": "` + userFromDB.Id.String() + `", "token": "` + token + `", "message": "Logged in"}`))
}
