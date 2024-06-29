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
	router.HandleFunc("/posts/get/most/{attribute}", getMostInOneAttributePostsHandler).Methods("GET")
	router.HandleFunc("/search", searchPostsHandler).Methods("GET")
	router.HandleFunc("/postHistory/{userID}", getUserPostsHandler).Methods("GET")
	router.HandleFunc("/public/{userID}", getUserInfoByIDHandler).Methods("GET")
	router.HandleFunc("/saveUserInfo", saveUserInfoHandler).Methods("POST")
	router.HandleFunc("/public/getUserID/{username}", getUserIDByNameHandler).Methods("GET")
	router.HandleFunc("/public/getUsername/{userID}", getUsernameByIDHandler).Methods("GET")
	router.HandleFunc("/user/comments/upload", uploadCommentHandler).Methods("POST")
	router.HandleFunc("/user/comments/delete/{commentID}", deleteCommentHandler).Methods("DELETE")
	router.HandleFunc("/user/subcomments/upload", uploadSubcommentHandler).Methods("POST")
	router.HandleFunc("/user/subcomments/delete/{subcommentID}", deleteSubcommentHandler).Methods("DELETE")
	router.HandleFunc("/public/getComments/{postID}", getCommentsByPostIDHandler).Methods("GET")
	router.HandleFunc("/public/getSubcomments/{commentID}", getSubcommentsByCommentIDHandler).Methods("GET")

	// Set up CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
	)

	// Apply the CORS middleware to the router
	return corsMiddleware(router)
}
