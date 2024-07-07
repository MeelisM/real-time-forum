package user

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

func (h *Handler) GetProfilePictures(w http.ResponseWriter, r *http.Request) {
	profilePictures := models.GetProfilePictures()

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(profilePictures)
	if err != nil {
		http.Error(w, "Failed to encode profile pictures", http.StatusInternalServerError)
		return
	}
}
