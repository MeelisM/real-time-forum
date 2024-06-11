package comment

import (
	"encoding/json"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.HandleError(w, http.StatusBadRequest, "invalid request method")
		return
	}
	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, err.Error())
		return
	}

	comment.Id = uuid.New()

	err = h.CommentService.Create(&comment)
	if err != nil {
		utils.HandleError(w, http.StatusInternalServerError, err.Error())
		return
	}

	data := map[string]interface{}{
		"commentId": comment.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
