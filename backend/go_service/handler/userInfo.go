package handler

import (
	"encoding/json"
	"fmt"
	"strconv"

	//"log"
	"appBE/errors"
	"appBE/service"
	"net/http"

	"github.com/gorilla/mux"
)

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
		if err == errors.ErrUserNotFound{
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search user by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(user)
	if err != nil {
		http.Error(w, "Failed to parse user into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

func getUserIdByNameHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one get user info request")

	// 1. process data
	
	w.Header().Set("Content-Type", "application/json")
	username := mux.Vars(r)["username"]

	// 2. call service level to get user id
	userID, err := service.GetUserIdByName(username)
	if err != nil {
		// Check if the error is due to the user not being found
		if err == errors.ErrUserNotFound{
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			// For all other errors, return internal server error
			http.Error(w, "Failed to search user by ID from backend",
				http.StatusInternalServerError)
		}
		return
	}

	// 3. format json response
	js, err := json.Marshal(userID)
	if err != nil {
		http.Error(w, "Failed to parse user into JSON format",
			http.StatusInternalServerError)
		return
	}
	w.Write(js)
}