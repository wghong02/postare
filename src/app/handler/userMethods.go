package handler

import (
	"encoding/json"
	"fmt"
	"regexp"
	"time"

	//"log"
	"appBE/model"
	"appBE/service"
	"net/http"

	jwt "github.com/form3tech-oss/jwt-go"
)

var mySigningKey = []byte("secret")

func registerHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one register request")
	w.Header().Set("Content-Type", "text/plain")

    // Parse from body of request to get a json object.
    decoder := json.NewDecoder(r.Body)
    var user model.User
    if err := decoder.Decode(&user); err != nil {
        http.Error(w, "Cannot decode user data from client", http.StatusBadRequest)
        fmt.Printf("Cannot decode user data from client %v\n", err)
        return
    }

    if user.Username == "" || user.Password == "" || regexp.MustCompile(`^[a-z0-9]$`).MatchString(user.Username) {
        http.Error(w, "Invalid username or password", http.StatusBadRequest)
        fmt.Printf("Invalid username or password\n")
        return
    }

    user.RegisterDate = time.Now()
    user.UserRating = 0
    user.TotalItemsSold = 0

    success, err := service.RegisterUser(&user)
    if  err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        fmt.Printf("Failed to save user to SQL %v\n", err)
        return
    }

    if !success {
        http.Error(w, "User already exists", http.StatusBadRequest)
        fmt.Println("User already exists")
        return
    }

    fmt.Fprintf(w, "User registered successfully: %s\n", user.Username)
}

func logInHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one login request")
	w.Header().Set("Content-Type", "text/plain")

    // Parse from body of request to get a json object.
    decoder := json.NewDecoder(r.Body)
    var user model.User
    if err := decoder.Decode(&user); err != nil {
        http.Error(w, "Cannot decode user data from client", http.StatusBadRequest)
        fmt.Printf("Cannot decode user data from client %v\n", err)
        return
    }

    success, userID, err := service.ValidateUser(user.Username, user.Password)

    if  err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        fmt.Printf("Failed to save user to SQL %v\n", err)
        return
    }

    if !success {
        http.Error(w, "Username or password incorrect", http.StatusBadRequest)
        fmt.Println("Username or password incorrect")
        return
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userID":   userID,
        "exp":      time.Now().Add(time.Hour*3).Unix(),
    })

    tokenString, err := token.SignedString(mySigningKey)
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        fmt.Printf("Failed to generate token %v\n", err)
        return
    }

    w.Write([]byte(tokenString))
    fmt.Fprintf(w, "\n User log in successfully: %s\n", user.Username)
}