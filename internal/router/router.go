package router

import (
	"net/http"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/comment"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/post"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/handlers/user"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/middleware"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/services"
)

type Router struct {
	UserHandler    *user.Handler
	PostHandler    *post.Handler
	CommentHandler *comment.Handler
	Mux            *http.ServeMux
}

func NewRouter(userService services.UserService, postService services.PostService, commentService services.CommentService) *Router {
	userHandler := user.NewHandler(userService)
	postHandler := post.NewHandler(postService)
	commentHandler := comment.NewHandler(commentService)
	mux := http.NewServeMux()
	return &Router{UserHandler: userHandler, PostHandler: postHandler, CommentHandler: commentHandler, Mux: mux}
}

func (r *Router) InitializeRoutes() {
	r.initializeApiRoutes()
}

func (r *Router) initializeApiRoutes() {
	apiPrefix := "/api"
	// user routes
	r.Mux.Handle("POST "+apiPrefix+"/user", middleware.SendApiResponse(http.HandlerFunc(r.UserHandler.Create)))
	r.Mux.Handle("POST "+apiPrefix+"/user/login", middleware.SendApiResponse(http.HandlerFunc(r.UserHandler.Login)))

	// post routes
	r.Mux.Handle("POST "+apiPrefix+"/post", middleware.SendApiResponse(middleware.Authenticate(http.HandlerFunc(r.PostHandler.Create))))
	r.Mux.Handle("GET "+apiPrefix+"/post", middleware.SendApiResponse(middleware.Authenticate(http.HandlerFunc(r.PostHandler.List))))

	// comment routes
	r.Mux.Handle("POST "+apiPrefix+"/comment", middleware.SendApiResponse(middleware.Authenticate(http.HandlerFunc(r.CommentHandler.Create))))
	r.Mux.Handle("GET "+apiPrefix+"/comment/{postId}", middleware.SendApiResponse(middleware.Authenticate(http.HandlerFunc(r.CommentHandler.ListByPostId))))
}
