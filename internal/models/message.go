package models

import "time"

type Message struct {
	Id         string    `json:"id"`
	Content    string    `json:"content"`
	SenderId   string    `json:"senderId"`
	ReceiverId string    `json:"receiverId"`
	CreatedAt  time.Time `json:"createdAt"`
}
