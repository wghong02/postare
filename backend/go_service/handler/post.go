package handler

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"

	customErrors "appBE/errors"
	"appBE/model"
	"appBE/service"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func uploadPostHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one upload post request")

	// Read userID from request header or context passed from Spring Boot
	userIDStr := r.Header.Get("X-User-ID")
	if userIDStr == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Parse userID to int64
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")
	postDetails := r.FormValue("postDetails")
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Unable to read image", http.StatusBadRequest)
		return
	}
	defer file.Close()
	
	// Read file content into a buffer
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		http.Error(w, "Unable to read image", http.StatusBadRequest)
		return
	}	

	// Call service to process and save the post
	if err := service.UploadPost(userID,title, description, postDetails, buf, fileHeader); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "post owner does not exist", http.StatusBadRequest)
		} else if errors.Is(err, customErrors.ErrUnableToUploadToS3) {
			http.Error(w, "unable to upload image to s3", http.StatusInternalServerError)
		}else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to upload post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Post saved successfully\n")
}

func deletePostHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete post request")
	// Read userID from request header or context passed from Spring Boot
	userIDStr := r.Header.Get("X-User-ID")
	if userIDStr == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Parse userID to int64
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	// Get postID from URL parameters
	postIDStr := mux.Vars(r)["postID"]
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid post ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete post
	err = service.DeletePost(postID, userID)
	if err != nil {
		// Check if the error is due to the post not being found
		if errors.Is(err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrPostNotOwnedByUser){
			http.Error(w, "post not owned by user", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrUnableToDeleteFromS3){
			http.Error(w, "failed to delete file from S3", http.StatusInternalServerError)
		}else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to delete post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Post deleted successfully\n")
}

func searchPostsHandler(w http.ResponseWriter, r *http.Request) {
	// 1. process data
	// description here contains both post description and post title
	fmt.Println("Received one search request")
	w.Header().Set("Content-Type", "application/json")
	description := r.URL.Query().Get("description")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 1 {
		offset = 0 // default to first page
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 30 // default total size to load from server
	}

	// 2. call service to handle search
	posts, err := service.SearchPostsByDescription(description, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. format json response
	sendJSONResponse(w, posts, http.StatusOK)
}

func getPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get post by postid request")

	w.Header().Set("Content-Type", "application/json")
	postIDStr := mux.Vars(r)["postID"]

	// 1. process data
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid post ID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get post info
	post, err := service.GetPostByID(postID)
	if err != nil {
		// Check if the error is due to the post not being found
		if errors.Is(err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to get post by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, post, http.StatusOK)
}

func getMostInOneAttributePostsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get most xxx posts request")

	w.Header().Set("Content-Type", "application/json")
	attribute := mux.Vars(r)["attribute"]
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 1 {
		offset = 0 // default to first page
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 30 // default total size to load from server
	}

	var posts []model.Post

	// 2. call service to handle search
	posts, err = service.GetMostInOneAttributePosts(limit, offset, attribute)
	if err != nil {
		http.Error(w, "Failed to read posts from backend", http.StatusInternalServerError)
		return
	}

	// 3. format json response
	sendJSONResponse(w, posts, http.StatusOK)
}

func getUserPostsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get user posts request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	userIDStr := mux.Vars(r)["userID"]
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 1 {
		offset = 0 // default to first page
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 30 // default total size to load from server
	}

	// 1. process data
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid userID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get post info
	posts, err := service.GetPostsByUserID(userID, limit, offset)
	if err != nil {
		// Check if the error is due to the user not being found
		if errors.Is (err, customErrors.ErrUserNotFound) {
			http.Error(w, "user not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search user posts by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, posts, http.StatusOK)
}

func increaseViewByPostIDHandler(w http.ResponseWriter, r *http.Request){
	fmt.Println("Received one increase view request")

	// no response
	postIDStr := mux.Vars(r)["postID"]

	// 1. process data
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid post ID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get post info
	err = service.IncreaseViewByPostID(postID)
	if err != nil {
		// Check if the error is due to the posts not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search user posts by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format response
	fmt.Fprintf(w, "View increased successfully\n")
}

func getLikedPostsByUserIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get liked posts by userID request")

	// response is json
	w.Header().Set("Content-Type", "application/json")

	// 1. process data
	userIDStr := r.Header.Get("X-User-ID")
	if userIDStr == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	
	}
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 1 {
		offset = 0 // default to first page
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10 // default total size to load from server
	}
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid userID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get like info
	posts, err := service.GetLikedPostsByUserID(userID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrUserNotFound) {
			http.Error(w, "user not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search likes by userID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, posts, http.StatusOK)
}