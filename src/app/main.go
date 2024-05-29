package main

import (
	sqlMethods "appBE/database"
	"appBE/handler"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("started-service")
    sqlMethods.InitSQLDatabase()
	log.Fatal(http.ListenAndServe(":8080", handler.InitRouter()))
}

