package database

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

func Connect() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "internal/database/forum.db")
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %v", err)
	}

	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		return nil, fmt.Errorf("failed to enable foreign keys: %v", err)
	}

	err = createUsersTable(db)
	if err != nil {
		return nil, err
	}

	err = createPostsTable(db)
	if err != nil {
		return nil, err
	}

	err = createCommentsTable(db)
	if err != nil {
		return nil, err
	}

	err = createMessagesTable(db)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func createUsersTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY,
		username VARCHAR(32) NOT NULL CHECK(length(username) <= 32),
		email VARCHAR(255) NOT NULL CHECK(length(email) <= 255),
		password TEXT NOT NULL,
		age INTEGER NOT NULL,
		gender TEXT CHECK(Gender IN ('Male', 'Female', 'Prefer Not To Say')),
		first_name VARCHAR(64) NOT NULL CHECK(length(first_name) <= 64),
		last_name VARCHAR(64) NOT NULL CHECK(length(last_name) <= 64)
	)`)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}
	return nil
}

func createPostsTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS posts (
		id UUID PRIMARY KEY,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		user_id UUID NOT NULL,
		category TEXT NOT NULL, -- Add this line
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id)
	)`)
	if err != nil {
		return fmt.Errorf("failed to create posts table: %v", err)
	}
	return nil
}

func createCommentsTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS comments (
		id UUID PRIMARY KEY,
		content TEXT NOT NULL,
		user_id UUID NOT NULL,
		post_id UUID NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(user_id) REFERENCES users(id),
		FOREIGN KEY(post_id) REFERENCES posts(id)
	)`)
	if err != nil {
		return fmt.Errorf("failed to create comments table: %v", err)
	}
	return nil
}

func createMessagesTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS messages (
		id TEXT PRIMARY KEY,
		content TEXT,
		sender_id TEXT,
		receiver_id TEXT,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return fmt.Errorf("failed to create messages table: %v", err)
	}
	return nil
}
