package handler

import (
	"bytes"
	"encoding/json"
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
	fmt.Println("Received one upload request")

	// Read userID from request header or context passed from Spring Boot
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Parse userID to int64
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
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
	
	// Convert buffer to io.ReadSeeker
	fileReader := bytes.NewReader(buf.Bytes())
	
	imageURL, err := uploadToS3(fileReader, fileHeader.Filename)

	if err != nil {
		http.Error(w, "Failed to upload image to S3", http.StatusInternalServerError)
		return
	}

	post := model.Post{
		Title:       title,
		Description: description,
		ImageUrl:    imageURL,
		PostDetails: postDetails,
	}

	// Call service to process and save the post
	if err := service.UploadPost(&post, userIDInt); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "post owner does not exist", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to upload post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Post saved successfully\n")
	fmt.Fprintf(w, "Uploaded %s by %d \n", post.Title, userIDInt)
}

func deletePostHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete request")
	// Read userID from request header or context passed from Spring Boot
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Parse userID to int64
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
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
	imageUrl, err := service.DeletePost(postID, userIDInt)
	if err != nil {
		// Check if the error is due to the post not being found
		if errors.Is(err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrPostNotOwnedByUser){
			http.Error(w, "post not owned by user", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to delete post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	err = deleteFileFromS3(imageUrl)
	if err != nil {
		http.Error(w, "Failed to delete file from S3", http.StatusInternalServerError)
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
	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format", http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func getPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get post request")

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
	js, err := json.Marshal(post)
	if err != nil {
		http.Error(w, "Failed to parse post into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func getMostInOneAttributePostsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get most viewed posts request")

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
	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format", http.StatusInternalServerError)
		return
	}
	w.Write(js)
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
		// Check if the error is due to the posts not being found
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
	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}