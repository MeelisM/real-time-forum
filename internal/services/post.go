package services

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type PostService interface {
	Create(post *models.Post) error
	GetList() ([]models.PostWithComments, error)
	GetByID(postID string) (*models.PostWithComments, error)
}

type PostDatabaseService struct {
	Database *sql.DB
}

func NewPostService(db *sql.DB) PostService {
	return &PostDatabaseService{Database: db}
}

func (pds *PostDatabaseService) Create(post *models.Post) error {
	// Validate category
	validCategories := models.GetCategories()
	categoryValid := false
	for _, category := range validCategories {
		if category == post.Category {
			categoryValid = true
			break
		}
	}
	if !categoryValid {
		return fmt.Errorf("invalid category")
	}

	// Set timestamps
	createdAt := time.Now()
	updatedAt := createdAt
	post.CreatedAt = createdAt
	post.UpdatedAt = updatedAt

	_, err := pds.Database.Exec(
		"INSERT INTO posts (id, title, content, user_id, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		post.Id, post.Title, post.Content, post.UserId, post.Category, createdAt, updatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "FOREIGN KEY constraint failed") {
			return fmt.Errorf("user id not found")
		}
		return fmt.Errorf("failed to insert post: %v", err)
	}
	return nil
}

func (pds *PostDatabaseService) GetList() ([]models.PostWithComments, error) {
	query := `
		SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at, p.category, COUNT(c.id) AS comments_count
		FROM posts p
		LEFT JOIN comments c ON p.id = c.post_id
		GROUP BY p.id
	`

	rows, err := pds.Database.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve posts: %v", err)
	}
	defer rows.Close()

	var posts []models.PostWithComments
	for rows.Next() {
		var post models.PostWithComments
		err := rows.Scan(&post.Id, &post.Title, &post.Content, &post.UserId, &post.CreatedAt, &post.UpdatedAt, &post.Category, &post.CommentsCount)
		if err != nil {
			return nil, fmt.Errorf("failed to scan post: %v", err)
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func (pds *PostDatabaseService) GetByID(postID string) (*models.PostWithComments, error) {
	query := `
		SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at, p.category, COUNT(c.id) AS comments_count
		FROM posts p
		LEFT JOIN comments c ON p.id = c.post_id
		WHERE p.id = ?
		GROUP BY p.id
	`

	var post models.PostWithComments
	err := pds.Database.QueryRow(query, postID).Scan(&post.Id, &post.Title, &post.Content, &post.UserId, &post.CreatedAt, &post.UpdatedAt, &post.Category, &post.CommentsCount)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("post not found")
		}
		return nil, fmt.Errorf("failed to retrieve post: %v", err)
	}

	return &post, nil
}
