package middleware

import (
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/config"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
	"github.com/dgrijalva/jwt-go"
)

func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			errors.Handle(w, http.StatusUnauthorized, "authorization header missing", nil)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			errors.Handle(w, http.StatusUnauthorized, "invalid authorization header", nil)
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.LoadConfig().JWTSecret), nil
		})

		if err != nil || !token.Valid {
			errors.Handle(w, http.StatusUnauthorized, "invalid token", err)
			return
		}
		next.ServeHTTP(w, r)
	})
}
