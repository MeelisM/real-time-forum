package services

import (
	"database/sql"
	"fmt"

	"github.com/google/uuid"
)

type UserService interface {
	Create(username, email, password string, userId uuid.UUID) error
}

type UserDatabaseService struct {
	Database *sql.DB
}

func NewUserService(db *sql.DB) UserService {
	return &UserDatabaseService{Database: db}
}

func (uds *UserDatabaseService) Create(username, email, password string, userId uuid.UUID) error {
	_, err := uds.Database.Exec("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", userId, username, email, password)
	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	return nil
}
