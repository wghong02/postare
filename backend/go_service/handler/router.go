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
	router.HandleFunc("/user/userinfo/update", updateUserInfoHandler).Methods("POST")
	router.HandleFunc("/user/posts/upload", uploadPostHandler).Methods("POST")
	router.HandleFunc("/user/posts/delete/{postID}", deletePostHandler).Methods("DELETE")
	router.HandleFunc("/user/comments/upload", uploadCommentHandler).Methods("POST")
	router.HandleFunc("/user/comments/delete/{commentID}", deleteCommentHandler).Methods("DELETE")
	router.HandleFunc("/user/subComments/upload", uploadSubCommentHandler).Methods("POST")
	router.HandleFunc("/user/subComments/delete/{subCommentID}", deleteSubCommentHandler).Methods("DELETE")
	router.HandleFunc("/user/likes/upload", saveLikeHandler).Methods("POST")
	router.HandleFunc("/user/likes/delete/{postID}", unLikeHandler).Methods("DELETE")
	router.HandleFunc("/user/likes/check/{postID}", checkIfLikeExistsHandler).Methods("GET")
	router.HandleFunc("/user/posts/userLiked", getLikedPostsByUserIDHandler).Methods("GET")

	router.HandleFunc("/posts/postId/{postID}", getPostByIDHandler).Methods("GET")
	router.HandleFunc("/posts/most/{attribute}", getMostInOneAttributePostsHandler).Methods("GET")
	router.HandleFunc("/posts/view/{postID}", increaseViewByPostIDHandler).Methods("Post")
	router.HandleFunc("/posts/search", searchPostsHandler).Methods("GET")
	router.HandleFunc("/posts/history/{userID}", getUserPostsHandler).Methods("GET")
	
	router.HandleFunc("/public/userInfo", saveUserInfoHandler).Methods("POST")
	router.HandleFunc("/public/userInfo/userID/{userID}", getUserInfoByIDHandler).Methods("GET")
	router.HandleFunc("/public/userInfo/userLikes/{postID}", getLikedUsersByPostIDHandler).Methods("GET")
	router.HandleFunc("/public/userID/username/{username}", getUserIDByNameHandler).Methods("GET")
	router.HandleFunc("/public/username/userID/{userID}", getUsernameByIDHandler).Methods("GET")
	router.HandleFunc("/public/comments/postID/{postID}", getCommentsByPostIDHandler).Methods("GET")
	router.HandleFunc("/public/subComments/commentID/{commentID}", getSubCommentsByCommentIDHandler).Methods("GET")
	router.HandleFunc("/public/count/post/userID/{userID}", getPostCountByUserIDHandler).Methods("GET")
	router.HandleFunc("/public/count/comment/postID/{postID}", getCommentCountByPostIDHandler).Methods("GET")
	router.HandleFunc("/public/count/subComment/commentID/{commentID}", getSubCommentCountByCommentIDHandler).Methods("GET")
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
