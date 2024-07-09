package models

import (
	"github.com/google/uuid"
)

type User struct {
	Id                uuid.UUID `json:"id"`
	Username          string    `json:"username"`
	Email             string    `json:"email"`
	Password          string    `json:"password"`
	Age               int       `json:"age"`
	Gender            Gender    `json:"gender"`
	FirstName         string    `json:"firstName"`
	LastName          string    `json:"lastName"`
	ProfilePictureURL string    `json:"profilePictureURL"` // Added field
}

type Gender string

const (
	Male   Gender = "Male"
	Female Gender = "Female"
	PNTS   Gender = "Prefer Not To Say"
)

type UserClaims struct {
	Username string    `json:"username"`
	UserId   uuid.UUID `json:"userId"`
}

type LoginRequest struct {
	UsernameOrEmail string `json:"usernameOrEmail"`
	Password        string `json:"password"`
}

func GetProfilePictures() []string {
	return []string{
		"static/profile_pics/profilepic1.png",
		"static/profile_pics/profilepic2.png",
		"static/profile_pics/profilepic3.png",
		"static/profile_pics/profilepic4.png",
		"static/profile_pics/profilepic5.png",
		"static/profile_pics/profilepic6.png",
		"static/profile_pics/profilepic7.png",
		"static/profile_pics/profilepic8.png",
	}
}
