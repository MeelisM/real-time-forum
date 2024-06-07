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

	return db, nil
}

func createUsersTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY,
	username TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL
	)`)
	if err != nil {
		return fmt.Errorf("failed to creater users table: %v", err)
	}
	return nil
}
