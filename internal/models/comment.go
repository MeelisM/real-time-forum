package models

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	Id        uuid.UUID `json:"id"`
	Content   string    `json:"content"`
	UserId    uuid.UUID `json:"userId"`
	PostId    uuid.UUID `json:"postId"`
	CreatedAt time.Time `json:"createdAt"`
}
