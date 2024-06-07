package router

import (
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/ping"
)

func InitializeRoutes() {
	http.HandleFunc("/ping", ping.PingHandler)
}
