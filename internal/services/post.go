package services

import (
	"database/sql"
	"fmt"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type PostService interface {
	Create(post *models.Post) error
}

type PostDatabaseService struct {
	Database *sql.DB
}

func NewPostService(db *sql.DB) PostService {
	return &PostDatabaseService{Database: db}
}

func (pds *PostDatabaseService) Create(post *models.Post) error {

	// add timestamps
	createdAt := time.Now()
	updatedAt := createdAt

	_, err := pds.Database.Exec(
		"INSERT INTO posts (id, title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
		post.Id, post.Title, post.Content, post.UserId, createdAt, updatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert post: %v", err)
	}
	return nil
}
