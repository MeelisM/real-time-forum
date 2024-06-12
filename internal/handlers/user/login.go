package user

import (
	"encoding/json"
	"fmt"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, fmt.Sprintf("invalid request format: %v", err))
		return
	}

	userFromDB, token, err := h.UserService.Validate(user.Username, user.Email)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, "invalid login credentials")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userFromDB.Password), []byte(user.Password))
	if err != nil {
		utils.HandleError(w, http.StatusUnauthorized, "invalid login credentials")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"id": "` + userFromDB.Id.String() + `", "token": "` + token + `", "message": "Logged in"}`))
}
