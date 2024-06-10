package services

import (
	"database/sql"
	"fmt"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Create(user *models.User) error
	Validate(username, email string) (*models.User, error)
}

type UserDatabaseService struct {
	Database *sql.DB
}

func NewUserService(db *sql.DB) UserService {
	return &UserDatabaseService{Database: db}
}

func (uds *UserDatabaseService) Create(user *models.User) error {

	userExists, err := uds.isRegistered(user)
	if err != nil {
		return fmt.Errorf("failed to check if user exists: %v", err)
	}

	if userExists {
		return fmt.Errorf("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash the password: %v", err)
	}

	_, err = uds.Database.Exec("INSERT INTO users (id, username, email, password, age, gender, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", user.Id, user.Username, user.Email, string(hashedPassword), user.Age, user.Gender, user.FirstName, user.LastName)
	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	return nil
}

func (uds *UserDatabaseService) isRegistered(user *models.User) (bool, error) {
	var count int
	err := uds.Database.QueryRow(`SELECT COUNT(*) FROM users WHERE username = ? OR email = ? or id = ?`, user.Username, user.Email, user.Id).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check if username, email or id exists: %v", err)
	}
	return count > 0, nil
}

func (uds *UserDatabaseService) Validate(username string, email string) (*models.User, error) {
	var user models.User
	err := uds.Database.QueryRow(`SELECT id, password FROM users WHERE username = ? OR email = ?`, username, email).Scan(&user.Id, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		} else {
			return nil, fmt.Errorf("failed to get user: %v", err)
		}
	}
	return &user, nil
}
