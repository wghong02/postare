package handler

// import (
// 	"encoding/json"
// 	"fmt"
// 	"regexp"
// 	"strconv"
// 	"time"

// 	//"log"
// 	"appBE/model"
// 	"appBE/service"
// 	"net/http"

// 	jwt "github.com/form3tech-oss/jwt-go"
// 	"github.com/gorilla/mux"
// )

// // For token based auth
// var mySigningKey = []byte("secret")

// func registerHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Received one register request")
// 	w.Header().Set("Content-Type", "text/plain")

// 	// 1. process data
// 	// Parse from body of request to get a json object.
// 	decoder := json.NewDecoder(r.Body)
// 	var user model.User
// 	if err := decoder.Decode(&user); err != nil {
// 		http.Error(w, "Cannot decode user data from client",
// 			http.StatusBadRequest)
// 		fmt.Printf("Cannot decode user data from client %v\n", err)
// 		return
// 	}

// 	// username and password must not be empty. username must be
// 	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
// 	if user.Username == "" || user.Password == "" ||
// 		!usernameRegex.MatchString(user.Username) {
// 		http.Error(w, "Invalid username or password", http.StatusBadRequest)
// 		fmt.Printf("Invalid username or password\n")
// 		return
// 	}

// 	// email must be xxx@xxx.xxx
// 	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`)
// 	if user.UserEmail == "" || !emailRegex.MatchString(user.UserEmail) {
// 		http.Error(w, "Invalid email", http.StatusBadRequest)
// 		fmt.Printf("Invalid email, %s\n", user.UserEmail)
// 		return
// 	}

// 	// these fields are not user input
// 	user.RegisterDate = time.Now()
// 	user.UserRating = 0
// 	user.TotalItemsSold = 0
// 	user.TotalReviews = 0

// 	// 2. call service to process data
// 	// if error, database isuue; if not success, then user already exists
// 	success, err := service.RegisterUser(&user)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		fmt.Printf("Failed to save user to SQL %v\n", err)
// 		return
// 	}

// 	if !success {
// 		http.Error(w, "User already exists", http.StatusBadRequest)
// 		fmt.Println("User already exists")
// 		return
// 	}

// 	// 3. response

// 	fmt.Fprintf(w, "User registered successfully: %s\n", user.Username)
// }

// func logInHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Received one login request")
// 	w.Header().Set("Content-Type", "text/plain")

// 	// 1. process data
// 	// Parse from body of request to get a json object.
// 	decoder := json.NewDecoder(r.Body)
// 	var user model.User
// 	if err := decoder.Decode(&user); err != nil {
// 		http.Error(w, "Cannot decode user data from client",
// 			http.StatusBadRequest)
// 		fmt.Printf("Cannot decode user data from client %v\n", err)
// 		return
// 	}

// 	// 2. call service level to handle user validation
// 	success, userID, err := service.ValidateUser(user.Username, user.Password)

// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		fmt.Printf("Failed to save user to SQL %v\n", err)
// 		return
// 	}

// 	if !success {
// 		http.Error(w, "Username or password incorrect",
// 			http.StatusBadRequest)
// 		fmt.Println("Username or password incorrect")
// 		return
// 	}

// 	// 3. response
// 	// create auth token
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
// 		"userID": userID,
// 		"exp":    time.Now().Add(time.Hour * 3).Unix(), // lasts 3 hours
// 	})

// 	tokenString, err := token.SignedString(mySigningKey)
// 	if err != nil {
// 		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
// 		fmt.Printf("Failed to generate token %v\n", err)
// 		return
// 	}

// 	// put token to client
// 	w.Write([]byte(tokenString))
// }

// func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Received one get user info request")

// 	w.Header().Set("Content-Type", "application/json")
// 	userIDStr := mux.Vars(r)["userID"]

// 	// 1. process data
// 	userID, err := strconv.ParseInt(userIDStr, 10, 64)
// 	if err != nil {
// 		http.Error(w, "Invalid userID provided", http.StatusBadRequest)
// 		return
// 	}

// 	// 2. call service level to get user info
// 	user, err := service.SearchUserByID(userID)
// 	if err != nil {
// 		// Check if the error is due to the user not being found
// 		if err.Error() == fmt.Sprintf("no user found with ID %d", userID) {
// 			http.Error(w, err.Error(), http.StatusNotFound)
// 		} else {
// 			// For all other errors, return internal server error
// 			http.Error(w, "Failed to search user by ID from backend",
// 				http.StatusInternalServerError)
// 		}
// 		return
// 	}

// 	// 3. format json response
// 	js, err := json.Marshal(user)
// 	if err != nil {
// 		http.Error(w, "Failed to parse user into JSON format",
// 			http.StatusInternalServerError)
// 		return
// 	}
// 	w.Write(js)
// }
