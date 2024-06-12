package services

import (
	"database/sql"
	"fmt"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type CommentService interface {
	Create(comment *models.Comment) error
	GetByID(postID string) ([]*models.Comment, error)
}

type CommentDatabaseService struct {
	Database *sql.DB
}

func NewCommentService(db *sql.DB) CommentService {
	return &CommentDatabaseService{Database: db}
}

func (cds *CommentDatabaseService) Create(comment *models.Comment) error {
	createdAt := time.Now()
	comment.CreatedAt = createdAt

	_, err := cds.Database.Exec(
		"INSERT INTO comments (id, content, user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)",
		comment.Id, comment.Content, comment.UserId, comment.PostId, createdAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert comment: %v", err)
	}
	return nil
}

func (cds *CommentDatabaseService) GetByID(postID string) ([]*models.Comment, error) {
	rows, err := cds.Database.Query("SELECT id, content, user_id, post_id, created_at FROM comments WHERE post_id = ?", postID)
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
