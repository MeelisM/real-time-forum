package middleware

import (
	"net/http"
	"strings"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/config"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/utils"
	"github.com/dgrijalva/jwt-go"
)

func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.HandleError(w, http.StatusUnauthorized, "authorization header missing")
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.HandleError(w, http.StatusUnauthorized, "invalid authorization header")
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.LoadConfig().JWTSecret), nil
		})

		if err != nil || !token.Valid {
			utils.HandleError(w, http.StatusUnauthorized, "invalid token")
			return
		}
		next.ServeHTTP(w, r)
	})
}
