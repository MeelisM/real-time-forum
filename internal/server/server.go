package server

import (
	"log"
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/config"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/database"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/router"
)

func Start() error {
	// Load environment variables.
	cfg := config.LoadConfig()
	if cfg.Port == "" {
		log.Fatalf("Missing PORT environment variable!")
	}

	// Connect to the database.
	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Successfully connected to the database")
	defer db.Close()

	// Initialize all the routes.
	router.InitializeRoutes()

	log.Printf("Server started on port %s\n", cfg.Port)
	return http.ListenAndServe(":"+cfg.Port, nil)
}
