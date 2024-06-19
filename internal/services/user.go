package services

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/config"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Create(user *models.User) error
	ValidateLogin(usernameOrEmail, password string) (*models.User, string, error)
	GetList() ([]models.User, error)
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

// checkPassword compares the provided password with the hashed password from the database.
func checkPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func (uds *UserDatabaseService) ValidateLogin(usernameOrEmail, password string) (*models.User, string, error) {
	var user models.User
	var err error

	// Check if the input is an email or username
	isEmail := strings.Contains(usernameOrEmail, "@")

	if isEmail {
		// Query by email
		err = uds.Database.QueryRow(`SELECT id, username, email, password FROM users WHERE email = ?`, usernameOrEmail).Scan(&user.Id, &user.Username, &user.Email, &user.Password)
	} else {
		// Query by username
		err = uds.Database.QueryRow(`SELECT id, username, email, password FROM users WHERE username = ?`, usernameOrEmail).Scan(&user.Id, &user.Username, &user.Email, &user.Password)
	}

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("User not found")
			return nil, "", fmt.Errorf("user not found")
		} else {
			fmt.Println("Failed to get user:", err)
			return nil, "", fmt.Errorf("failed to get user: %v", err)
		}
	}

	if !checkPassword(user.Password, password) {
		return nil, "", fmt.Errorf("invalid login credentials")
	}

	userClaims := models.UserClaims{
		Username: user.Username,
		UserId:   user.Id,
	}

	token, err := createToken(userClaims)
	if err != nil {
		fmt.Println("Failed to create token:", err)
		return nil, "", fmt.Errorf("failed to create token: %v", err)
	}

	return &user, token, nil
}

func createToken(userClaims models.UserClaims) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userClaims.UserId.String()
	claims["username"] = userClaims.Username
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	tokenString, err := token.SignedString([]byte(config.LoadConfig().JWTSecret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (uds *UserDatabaseService) GetList() ([]models.User, error) {
	rows, err := uds.Database.Query("SELECT id, username FROM users")
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve users: %v", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.Id, &user.Username)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %v", err)
		}
		users = append(users, user)
	}

	return users, nil
}
