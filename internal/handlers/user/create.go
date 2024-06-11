package user

import (
	"encoding/json"
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
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

	if strings.TrimSpace(user.Username) == "" || strings.TrimSpace(user.Email) == "" {
		utils.HandleError(w, http.StatusBadRequest, "username and email required")
		return
	}

	user.Id = uuid.New()

	err = h.UserService.Create(&user)
	if err != nil {
		utils.HandleError(w, http.StatusConflict, err.Error())
		return
	}

	data := map[string]interface{}{
		"userId": user.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
