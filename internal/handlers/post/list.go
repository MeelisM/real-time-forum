package post

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
)

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	posts, err := h.PostService.GetAll()
	if err != nil {
		utils.HandleError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		utils.HandleError(w, http.StatusInternalServerError, err.Error())
	}
}
