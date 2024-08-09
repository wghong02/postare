package handler

import (
	customErrors "appBE/errors"
	"appBE/service"
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read body", http.StatusBadRequest)
		return
	}

	// Call service to process and save the comment
	if err := service.UploadComment(body, userID); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "comment owner does not exist", http.StatusBadRequest)
		} else if errors.Is(err, customErrors.ErrUnableToParseJson) {
			http.Error(w, "unable to parse json", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to save comment from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userID)
}

func uploadSubCommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one upload sub comment request")

	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Content-Type is not application/json", http.StatusUnsupportedMediaType)
		return
	}
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read body", http.StatusBadRequest)
		return
	}

	// Call service to process and save the subComment
	if err := service.UploadSubComment(body, userID); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "sub comment owner does not exist", http.StatusBadRequest)
		} else if errors.Is(err, customErrors.ErrUnableToParseJson) {
			http.Error(w, "unable to parse json", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to upload sub comment from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "Comment saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userID)
}

func deleteCommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete comment request")
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

	// Get commentID from URL parameters
	commentIDStr := mux.Vars(r)["commentID"]
	commentID, err := strconv.ParseInt(commentIDStr, 10 ,64)
	if err != nil {
		http.Error(w, "Invalid comment ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete comment
	err = service.DeleteComment(commentID, userID)
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

func deleteSubCommentHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete comment request")
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

	// Get commentID from URL parameters
	subCommentIDStr := mux.Vars(r)["subCommentID"]
	subCommentID, err := strconv.ParseInt(subCommentIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid subComment ID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete comment
	err = service.DeleteSubComment(subCommentID, userID)
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

	// 2. call service level to get comment info
	comments, err := service.GetCommentsByPostID(postID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search post's comments by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, comments, http.StatusOK)
}

func getSubCommentsByCommentIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get subComments by postID request")

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
		http.Error(w, "Invalid commentID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get sub comment info
	subComments, err := service.GetSubCommentsByCommentID(commentID, limit, offset)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrCommentNotFound) {
			http.Error(w, "comment not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search subComments by comment ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, subComments, http.StatusOK)
}

func getCommentCountByPostIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get comment count request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	isTotalStr := r.URL.Query().Get("isTotal")
	postIDStr := mux.Vars(r)["postID"]

	// 1. process data
	isTotal := false

    // Check if the parameter has a value
    if isTotalStr != "" {
        // Parse the string to a boolean
        var err error
        isTotal, err = strconv.ParseBool(isTotalStr)
        if err != nil {
            http.Error(w, "Invalid value for isTotal", http.StatusBadRequest)
            return
        }
    }

	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get comment count
	count, err := service.GetCommentCountByPostID(postID, isTotal)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrPostNotFound) {
			http.Error(w, "post not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search comment count by post ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, count, http.StatusOK)
}

func getSubCommentCountByCommentIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get comment count request")

	// response is json
	w.Header().Set("Content-Type", "application/json")
	commentIDStr := mux.Vars(r)["commentID"]

	// 1. process data
	commentID, err := strconv.ParseInt(commentIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get subcomment count
	count, err := service.GetSubCommentCountByCommentID(commentID)
	if err != nil {
		// Check if the error is due to the comments not being found
		if errors.Is (err, customErrors.ErrCommentNotFound) {
			http.Error(w, "comment not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search subComment count by comment ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, count, http.StatusOK)
}