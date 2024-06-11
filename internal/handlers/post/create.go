package post

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
	var post models.Post

	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, err.Error())
		return
	}

	if post.Title == "" || post.Content == "" {
		utils.HandleError(w, http.StatusBadRequest, "title or content cannot be empty")
		return
	}
	if len(post.Title) > 255 || len(post.Content) > 10000 {
		utils.HandleError(w, http.StatusBadRequest, "title or content exceed maximum length")
		return
	}
	if _, err := uuid.Parse(post.UserId.String()); err != nil {
		utils.HandleError(w, http.StatusBadRequest, "invalid userId, it must be a valid UUID")
		return
	}

	post.Id = uuid.New()

	err = h.PostService.Create(&post)
	if err != nil {
		utils.HandleError(w, http.StatusInternalServerError, err.Error())
		return
	}

	data := map[string]interface{}{
		"postId": post.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
