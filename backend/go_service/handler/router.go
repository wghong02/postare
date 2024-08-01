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
	router.HandleFunc("/user/comments/upload", uploadCommentHandler).Methods("POST")
	router.HandleFunc("/user/comments/delete/{commentID}", deleteCommentHandler).Methods("DELETE")
	router.HandleFunc("/user/subComments/upload", uploadSubCommentHandler).Methods("POST")
	router.HandleFunc("/user/subComments/delete/{subCommentID}", deleteSubCommentHandler).Methods("DELETE")
	router.HandleFunc("/user/likes/upload", saveLikeHandler).Methods("POST")
	router.HandleFunc("/user/likes/delete/{postID}", unLikeHandler).Methods("DELETE")
	router.HandleFunc("/user/likes/check/{postID}", checkIfLikeExistsHandler).Methods("GET")
	router.HandleFunc("/user/posts/get/liked", getLikedPostsByUserIDHandler).Methods("GET")

	router.HandleFunc("/saveUserInfo", saveUserInfoHandler).Methods("POST")
	router.HandleFunc("/posts/{postID}", getPostByIDHandler).Methods("GET")
	router.HandleFunc("/posts/get/most/{attribute}", getMostInOneAttributePostsHandler).Methods("GET")
	router.HandleFunc("/posts/increasePostView/{postID}", increaseViewByPostIDHandler).Methods("Post")
	router.HandleFunc("/search", searchPostsHandler).Methods("GET")
	router.HandleFunc("/postHistory/{userID}", getUserPostsHandler).Methods("GET")
	
	router.HandleFunc("/public/getUserInfo/{userID}", getUserInfoByIDHandler).Methods("GET")
	router.HandleFunc("/public/getUserID/{username}", getUserIDByNameHandler).Methods("GET")
	router.HandleFunc("/public/getUsername/{userID}", getUsernameByIDHandler).Methods("GET")
	router.HandleFunc("/public/getComments/{postID}", getCommentsByPostIDHandler).Methods("GET")
	router.HandleFunc("/public/getSubComments/{commentID}", getSubCommentsByCommentIDHandler).Methods("GET")
	router.HandleFunc("/public/getCommentCount/{postID}", getCommentCountByPostID).Methods("GET")
	router.HandleFunc("/public/getSubCommentCount/{commentID}", getSubCommentCountByCommentID).Methods("GET")
	router.HandleFunc("/public/getLikedUsersByPost/{postID}", getLikedUsersByPostIDHandler).Methods("GET")
	// router.HandleFunc("/public/getLikesCount/{postID}", getLikeCountByPostIDHandler).Methods("GET")
	
	// Set up CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
	)

	// Apply the CORS middleware to the router
	return corsMiddleware(router)
}
