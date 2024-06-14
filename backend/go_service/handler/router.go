package handler

import (
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func InitRouter() http.Handler {
	// // use jwt middleware for token auth
	// jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
	// 	ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
	// 		return []byte(mySigningKey), nil
	// 	},
	// 	SigningMethod: jwt.SigningMethodHS256,
	// })

	router := mux.NewRouter()
	router.HandleFunc("/user/posts/upload", uploadPostHandler).Methods("POST")
	router.HandleFunc("/user/posts/delete/{postID}", deletePostHandler).Methods("DELETE")
	router.HandleFunc("/posts/{postID}", getPostByIDHandler).Methods("GET")
	router.HandleFunc("/posts/get/mostViewed", getMostViewedPostsHandler).Methods("GET")
	router.HandleFunc("/search", searchPostsHandler).Methods("GET")
	router.HandleFunc("/postHistory/{userID}", getUserPostsHandler).Methods("GET")
	router.HandleFunc("/users/{userID}", getUserInfoByIDHandler).Methods("GET")
	// router.HandleFunc("/auth/register", handlers.RegisterHandler).Methods("POST")
	// router.HandleFunc("/auth/login", handlers.LogInHandler).Methods("POST")

	// Set up CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
	)

	// Apply the CORS middleware to the router
	return corsMiddleware(router)
}
