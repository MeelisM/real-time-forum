package services

import (
	"database/sql"
	"fmt"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type CommentService interface {
	Create(comment *models.Comment) error
}

type CommentDatabaseService struct {
	Database *sql.DB
}

func NewCommentService(db *sql.DB) CommentService {
	return &CommentDatabaseService{Database: db}
}

func (cds *CommentDatabaseService) Create(comment *models.Comment) error {
	if comment.Content == "" {
		return fmt.Errorf("content cannot be empty")
	}

	if len(comment.Content) > 1000 {
		return fmt.Errorf("content exceeds maximum length")
	}

	createdAt := time.Now()

	_, err := cds.Database.Exec(
		"INSERT INTO comments (id, content, user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)",
		comment.Id, comment.Content, comment.UserId, comment.PostId, createdAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert comment: %v", err)
	}
	return nil
}
