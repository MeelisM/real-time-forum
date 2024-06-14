package config

import (
	"bufio"
	"log"
	"os"
	"strings"
	"sync"
)

type Config struct {
	Port            string
	JWTSecret       string
	OriginAllowlist []string
}

var (
	config *Config
	once   sync.Once
)

func LoadConfig() *Config {
	once.Do(func() {
		config = &Config{}

		loadEnvFile(".env")
		loadFromEnv(config)

		if config.Port == "" {
			log.Fatalf("Missing PORT in environment variables!")
		}
		if config.JWTSecret == "" {
			log.Fatalf("Missing JWT_SECRET in environment variables!")
		}
		if len(config.OriginAllowlist) == 0 || config.OriginAllowlist[0] == "" {
			log.Fatalf("Missing ORIGIN_ALLOWLIST in environment variables!")
		}
	})

	return config
}

func loadEnvFile(filename string) {
	file, err := os.Open(filename)
	if err != nil {
		log.Printf("Error opening .env file: %v\n", err)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key, value := strings.TrimSpace(parts[0]), strings.TrimSpace(parts[1])
		if os.Getenv(key) == "" {
			os.Setenv(key, value)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Printf("Error reading .env file: %v\n", err)
	}
}

func loadFromEnv(config *Config) {
	config.Port = os.Getenv("PORT")
	config.JWTSecret = os.Getenv("JWT_SECRET")
	config.OriginAllowlist = strings.Split(os.Getenv("ORIGIN_ALLOWLIST"), ",")
}
