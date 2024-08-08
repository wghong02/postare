package handler

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"strconv"

	//"log"
	customErrors "appBE/errors"
	"appBE/service"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func saveUserInfoHandler (w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one save user info request")

	// Check data type
	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Content-Type is not application/json", http.StatusUnsupportedMediaType)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read body", http.StatusBadRequest)
		return
	}

	// Call service to process and save the post
	if err := service.SaveUserInfo(body); err != nil {
		if errors.Is(err, customErrors.ErrUsernameAlreadyExists) {
			http.Error(w, "user already exists", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrUnableToParseJson) {
			http.Error(w, "unable to parse json", http.StatusNotFound)
		} else {
			log.Printf("Error saving user info: %v", err)
			// For all other errors, return internal server error
			http.Error(w, "Failed to save user from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "User info saved successfully\n")
	sendStatusCode(w, http.StatusOK)
}

func updateUserInfoHandler (w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one update user info request")

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

	userEmail := r.FormValue("userEmail")
	userPhone := r.FormValue("userPhone")
	userNickname := r.FormValue("nickname")
	bio := r.FormValue("bio")
	file, fileHeader, err := r.FormFile("profilePicture")
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
	if err := service.UpdateUserInfo(userID, userEmail, userPhone, userNickname, bio, buf, fileHeader); err != nil {
		if errors.Is(err, customErrors.ErrUsernameAlreadyExists) {
			http.Error(w, "user already exists", http.StatusNotFound)
		} else if errors.Is(err, customErrors.ErrUnableToUploadToS3){
			http.Error(w, "Failed to upload image to S3", http.StatusInternalServerError)
		} else {
			log.Printf("Error saving user info: %v", err)
			// For all other errors, return internal server error
			http.Error(w, "Failed to save user from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// Response
	fmt.Fprintf(w, "User info saved successfully\n")
	sendStatusCode(w, http.StatusOK)
}

func getUserInfoByIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get user info request")

	w.Header().Set("Content-Type", "application/json")
	userIDStr := mux.Vars(r)["userID"]

	// 1. process data
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid userID provided", http.StatusBadRequest)
		return
	}

	// 2. call service level to get user info
	user, err := service.GetUserInfoByID(userID)
	if err != nil {
		// Check if the error is due to the user not being found
		if errors.Is(err, customErrors.ErrUserNotFound){
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search user by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, user, http.StatusOK)
}

func getUserIDByNameHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get user id request")

	// 1. process data
	w.Header().Set("Content-Type", "application/json")
	username := mux.Vars(r)["username"]

	// 2. call service level to get user id
	userID, err := service.GetUserIDByName(username)
	if err != nil {
		// Check if the error is due to the user not being found
		if errors.Is(err, customErrors.ErrUserNotFound){
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, err.Error(),
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, userID, http.StatusOK)
}

func getUsernameByIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get username by userid request")

	// 1. process data
	
	w.Header().Set("Content-Type", "application/json")
	userIDStr := mux.Vars(r)["userID"]

	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid userID provided", http.StatusBadRequest)
		return
	}
	// 2. call service level to get user id
	username, err := service.GetUsernameByID(userID)
	if err != nil {
		// Check if the error is due to the user not being found
		if errors.Is(err, customErrors.ErrUserNotFound){
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, err.Error(),
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	sendJSONResponse(w, username, http.StatusOK)
}

func getLikedUsersByPostIDHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get liked users by postID request")

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

	// 2. call service level to get like info
	users, err := service.GetLikedUsersByPostID(postID, limit, offset)
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
	sendJSONResponse(w, users, http.StatusOK)
}