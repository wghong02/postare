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

func saveLikeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one save like request")

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

	// Call service to process and save the like
	if err := service.LikePost(body, userID); err != nil {
		if errors.Is(err, customErrors.ErrUserNotFound) {
			http.Error(w, "liker does not exist", http.StatusBadRequest)
		} else if errors.Is(err, customErrors.ErrUnableToParseJson) {
			http.Error(w, "unable to parse json", http.StatusBadRequest)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to save likes from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	sendStatusCode(w, http.StatusOK)
	fmt.Fprintf(w, "Like saved successfully\n")
	fmt.Fprintf(w, "Uploaded by %d \n", userID)
}

func unLikeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one delete like request")
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
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// Call service level to delete like
	err = service.UnlikePost(userID, postID)
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
	fmt.Fprintf(w, "Like deleted successfully\n")
	sendStatusCode(w, http.StatusOK)
}

func checkIfLikeExistsHandler(w http.ResponseWriter, r *http.Request){
	fmt.Println("Received one get check like exist request")

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
		http.Error(w, "Invalid postID provided", http.StatusBadRequest)
		return
	}

	// Call service level to find like
	exists, err := service.CheckIfLikeExists(userID, postID)
	if err != nil {
		
		// For all other errors, return internal server error
		http.Error(w, "Failed to check like from backend",
			http.StatusInternalServerError)
		
		return
	}

	// Response
	w.Header().Set("Content-Type", "text/plain")
	if exists {
        fmt.Fprint(w, "true")
    } else {
        fmt.Fprint(w, "false")
    }
}