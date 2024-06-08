package models

import (
	"strings"

	"github.com/google/uuid"
)

type User struct {
	Id       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
}

func (u *User) ToLowerCase(email string) {
	u.Email = strings.ToLower(email)
}
