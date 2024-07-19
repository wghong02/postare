package handler

import (
	customErrors "appBE/errors"
	"appBE/model"
	"appBE/service"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func saveLikeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one save like request")

	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Content-Type is not application/json", http.StatusUnsupportedMediaType)
		return
	}
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read body", http.StatusBadRequest)
		return
	}

	var like model.Like
	if err := json.Unmarshal(body, &like); err != nil {
		http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
		return
	}

	// Call service to process and save the like
	if err := service.LikePost(&like, userIDInt); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "liker does not exist", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to save likes from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userIDInt)
}

func unLikeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete like request")
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

	// Get likeID from URL parameters
	likeIDStr := mux.Vars(r)["likeID"]
	likeID, err := strconv.ParseInt(likeIDStr, 10 ,64)
	if err != nil {
		http.Error(w, "Invalid comment ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete like
	err = service.UnlikePost(likeID, userIDInt)
	if err != nil {
		// Check if the error is due to the like not being found
		if errors.Is(err, customErrors.ErrLikeNotFound) {
			http.Error(w, "like not found", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrNotLikedByUser) {
			http.Error(w, "not liked by user", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to delete comment from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment deleted successfully\n")
}

func getLikesByPostIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get likes by postID request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	postIDStr := mux.Vars(r)["postID"]
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

	// 1. process data
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get post info
	likes, err := service.GetLikesByPostID(postID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search post likes by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(likes)
	if err != nil {
		http.Error(w, "Failed to parse likes into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func getLikeCountByPostID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get like count request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	postIDStr := mux.Vars(r)["postID"]

	// 1. process data
	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get like count
	count, err := service.GetLikesCountByPostID(postID)
	if err != nil {
		// Check if the error is due to the post not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search likes by post ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(count)
	if err != nil {
		http.Error(w, "Failed to parse count into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}