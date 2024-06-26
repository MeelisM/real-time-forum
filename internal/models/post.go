package models

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	Id        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	UserId    uuid.UUID `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type PostWithComments struct {
	Post
	CommentsCount int        `json:"commentsCount"`
	Comments      []*Comment `json:"comments,omitempty"`
}
