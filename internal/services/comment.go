package services

import (
	"database/sql"
	"fmt"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type CommentService interface {
	Create(comment *models.Comment) error
	GetAll() ([]*models.Comment, error)
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

	createdAt := comment.CreatedAt

	_, err := cds.Database.Exec(
		"INSERT INTO comments (id, content, user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)",
		comment.Id, comment.Content, comment.UserId, comment.PostId, createdAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert comment: %v", err)
	}
	return nil
}

func (cds *CommentDatabaseService) GetAll() ([]*models.Comment, error) {
	rows, err := cds.Database.Query("SELECT id, content, user_id, post_id, created_at FROM comments")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch comments: %v", err)
	}
	defer rows.Close()

	var comments []*models.Comment
	for rows.Next() {
		var comment models.Comment
		if err := rows.Scan(&comment.Id, &comment.Content, &comment.UserId, &comment.PostId, &comment.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan comment: %v", err)
		}
		comments = append(comments, &comment)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %v", err)
	}

	return comments, nil
}
