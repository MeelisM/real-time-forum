package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type PostService interface {
	Create(title, content string, userId uuid.UUID) error
}

type PostDatabaseService struct {
	Database *sql.DB
}

func NewPostService(db *sql.DB) PostService {
	return &PostDatabaseService{Database: db}
}

func (pds *PostDatabaseService) Create(title, content string, userId uuid.UUID) error {
	if title == "" || content == "" {
		return fmt.Errorf("title and content cannot be empty")
	}

	if len(title) > 255 || len(content) > 10000 {
		return fmt.Errorf("title or content exceed maximum length")
	}

	// add timestamps
	createdAt := time.Now()
	updatedAt := createdAt

	_, err := pds.Database.Exec(
		"INSERT INTO posts (id, title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
		uuid.New(), title, content, userId, createdAt, updatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert post: %v", err)
	}
	return nil
}
