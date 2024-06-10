package main

import (
	sqlMethods "appBE/database"
	"appBE/handler"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("started-service")
	// initialize database
    sqlMethods.InitSQLDatabase()
	// load .env file
	err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
	// deploy to port 8080
	log.Fatal(http.ListenAndServe(":8080", handler.InitRouter()))
}

