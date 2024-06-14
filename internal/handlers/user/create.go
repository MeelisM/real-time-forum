package user

import (
	"encoding/json"
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errors.Handle(w, http.StatusBadRequest, "invalid request format", err)
		return
	}

	if strings.TrimSpace(user.Username) == "" || len(strings.TrimSpace(user.Username)) < 3 {
		errors.Handle(w, http.StatusBadRequest, "username is required and should be at least 3 characters long", nil)
		return
	}

	if strings.TrimSpace(user.Email) == "" || !strings.Contains(user.Email, "@") {
		errors.Handle(w, http.StatusBadRequest, "a valid email is required", nil)
		return
	}

	if len(strings.TrimSpace(user.Password)) < 8 {
		errors.Handle(w, http.StatusBadRequest, "password is required and should be at least 8 characters long", nil)
		return
	}

	user.Id = uuid.New()

	err = h.UserService.Create(&user)
	if err != nil {
		errors.Handle(w, http.StatusConflict, "an error occurred while creating the user", err)
		return
	}

	data := map[string]interface{}{
		"userId": user.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
