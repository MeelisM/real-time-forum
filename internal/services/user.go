package services

import (
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
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

	userExists, err := uds.isRegistered(email, userId)
	if err != nil {
		return fmt.Errorf("failed to check if user exists: %v", err)
	}

	if userExists {
		return fmt.Errorf("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash the password: %v", err)
	}

	_, err = uds.Database.Exec("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", userId, username, email, string(hashedPassword))
	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	return nil
}

func (uds *UserDatabaseService) isRegistered(email string, userId uuid.UUID) (bool, error) {
	var count int
	err := uds.Database.QueryRow(`SELECT COUNT(*) FROM users WHERE email = ? or id = ?`, email, userId).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check if email or id exists: %v", err)
	}
	return count > 0, nil
}
