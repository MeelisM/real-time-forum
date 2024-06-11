package user

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.HandleError(w, http.StatusBadRequest, "invalid request method")
		return
	}

	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, err.Error())
		return
	}

	userFromDB, err := h.UserService.Validate(user.Username, user.Email)
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
	w.Write([]byte(`{"id": "` + userFromDB.Id.String() + `", "message": "Logged in"}`))
}
