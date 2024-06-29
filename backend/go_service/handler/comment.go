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

func uploadCommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one upload comment request")

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

	var comment model.Comment
	if err := json.Unmarshal(body, &comment); err != nil {
		http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
		return
	}

	// Call service to process and save the post
	if err := service.UploadComment(&comment, userIDInt); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "comment owner does not exist", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to comment post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userIDInt)
}

func uploadSubcommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one upload sub comment request")

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

	var subcomment model.SubComment
	if err := json.Unmarshal(body, &subcomment); err != nil {
		http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
		return
	}

	// Call service to process and save the subcomment
	if err := service.UploadSubcomment(&subcomment, userIDInt); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "sub comment owner does not exist", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to sub comment post from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userIDInt)
}

func deleteCommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete comment request")
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

	// Get commentID from URL parameters
	commentIDStr := mux.Vars(r)["commentID"]
	commentID, err := strconv.ParseInt(commentIDStr, 10 ,64)
	if err != nil {
		http.Error(w, "Invalid comment ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete comment
	err = service.DeleteComment(commentID, userIDInt)
	if err != nil {
		// Check if the error is due to the comment not being found
		if errors.Is(err, customErrors.ErrCommentNotFound) {
			http.Error(w, "comment not found", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrPostNotOwnedByUser) {
			http.Error(w, "comment not owned by user", http.StatusNotFound)
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

func deleteSubcommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete comment request")
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

	// Get commentID from URL parameters
	subcommentIDStr := mux.Vars(r)["subcommentID"]
	subcommentID, err := strconv.ParseInt(subcommentIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid subcomment ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete comment
	err = service.DeleteSubcomment(subcommentID, userIDInt)
	if err != nil {
		// Check if the error is due to the comment not being found
		if errors.Is(err, customErrors.ErrCommentNotFound) {
			http.Error(w, "sub comment not found", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrPostNotOwnedByUser) {
			http.Error(w, "sub comment not owned by user", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to delete sub comment from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Sub Comment deleted successfully\n")
}

func getCommentsByPostIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get comments by postID request")

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
	comments, err := service.GetCommentsByPostID(postID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search post comments by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(comments)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func getSubcommentsByCommentIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get subcomments by postID request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	commentIDStr := mux.Vars(r)["commentID"]
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
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get post info
	subcomments, err := service.GetSubcommentsByCommentID(commentID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrCommentNotFound) {
			http.Error(w, "comment not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search subcomments by comment ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(subcomments)
	if err != nil {
		http.Error(w, "Failed to parse subcomments into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}