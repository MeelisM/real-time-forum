package router

import (
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/ping"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/post"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/user"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/services"
)

type Router struct {
	UserHandler *user.Handler
	PostHandler *post.Handler
	Mux         *http.ServeMux
}

func NewRouter(userService services.UserService, postService services.PostService) *Router {
	userHandler := user.NewHandler(userService)
	postHandler := post.NewHandler(postService)
	mux := http.NewServeMux()
	return &Router{UserHandler: userHandler, PostHandler: postHandler, Mux: mux}
}

func (r *Router) InitializeRoutes() {
	r.initializeApiRoutes()
}

func (r *Router) initializeApiRoutes() {
	apiPrefix := "/api"
	r.Mux.HandleFunc(apiPrefix+"/user", r.UserHandler.Create)
	r.Mux.HandleFunc(apiPrefix+"/post", r.PostHandler.Create)
	r.Mux.HandleFunc(apiPrefix+"/ping", ping.PingHandler)
}
