package post

import (
	"encoding/json"
	"fmt"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"github.com/google/uuid"
)

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {

	var post models.Post

	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		utils.HandleError(w, http.StatusBadRequest, fmt.Sprintf("invalid request format: %v", err))
		return
	}

	if post.Title == "" || post.Content == "" {
		utils.HandleError(w, http.StatusBadRequest, "title or content cannot be empty")
		return
	}
	if len(post.Title) > 255 || len(post.Content) > 10000 {
		utils.HandleError(w, http.StatusBadRequest, "title or content exceeds maximum length")
		return
	}
	if _, err := uuid.Parse(post.UserId.String()); err != nil {
		utils.HandleError(w, http.StatusBadRequest, "invalid userId")
		return
	}

	// Generate new UUID for the post
	post.Id = uuid.New()

	err = h.PostService.Create(&post)
	if err != nil {
		utils.HandleError(w, http.StatusInternalServerError, "an error ocurred while creating the post")
		return
	}

	data := map[string]interface{}{
		"postId": post.Id,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
