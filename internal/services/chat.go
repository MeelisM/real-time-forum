package services

import (
	"database/sql"
	"fmt"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
)

type ChatService interface {
	CreateMessage(message *models.Message) error
	GetMessagesByUserID(userID string) ([]*models.Message, error)
}

type ChatDatabaseService struct {
	Database *sql.DB
}

func NewChatService(db *sql.DB) ChatService {
	return &ChatDatabaseService{Database: db}
}

func (cds *ChatDatabaseService) CreateMessage(message *models.Message) error {
	message.CreatedAt = time.Now()

	_, err := cds.Database.Exec(
		"INSERT INTO messages (id, content, sender_id, receiver_id, created_at) VALUES (?, ?, ?, ?, ?)",
		message.Id, message.Content, message.SenderId, message.ReceiverId, message.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert message: %v", err)
	}
	return nil
}

func (cds *ChatDatabaseService) GetMessagesByUserID(userID string) ([]*models.Message, error) {
	rows, err := cds.Database.Query(
		"SELECT id, content, sender_id, receiver_id, created_at FROM messages WHERE receiver_id = ? OR sender_id = ?",
		userID, userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch messages: %v", err)
	}
	defer rows.Close()

	var messages []*models.Message
	for rows.Next() {
		var message models.Message
		if err := rows.Scan(&message.Id, &message.Content, &message.SenderId, &message.ReceiverId, &message.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan message: %v", err)
		}
		messages = append(messages, &message)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %v", err)
	}

	return messages, nil
}
