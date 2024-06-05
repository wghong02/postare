package sqlMethods

import (
	"appBE/model"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
)


func connectDB() *pgx.Conn {    
    // use pgx to connect to db
    dbUser:= os.Getenv("DB_USER")
    if dbUser == "" {
        log.Fatal("DB_USER is not set in the environment variables")
    }
    dbPassword := os.Getenv("DB_PASSWORD")
    if dbPassword == "" {
        log.Fatal("DB_PASSWORD is not set in the environment variables")
    }
    dbURL:= os.Getenv("DB_URL")
    if dbURL == "" {
        log.Fatal("DB_URL is not set in the environment variables")
    }
    connString := fmt.Sprintf("postgres://%s:%s@%s", dbUser, dbPassword, dbURL)
    conn, err := pgx.Connect(context.Background(), connString)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }
    return conn
}

func InitSQLDatabase() {
    // Set up connection string.
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
    fmt.Println("initializing sql")

    // defer close to continue useing
    conn := connectDB()
    defer conn.Close(context.Background())

    createTables(conn)
    insertSampleData(conn)
}

func createTables(conn *pgx.Conn) {
    // create sql tables
    commands := []string{
        `CREATE TABLE IF NOT EXISTS Users (
            UserID SERIAL PRIMARY KEY,
            Username VARCHAR(255),
            UserEmail VARCHAR(255),
            UserPhone VARCHAR(50),
            Password TEXT,
            Address TEXT,
            ProfilePicture TEXT,
            RegisterDate DATE,
			UserRating FLOAT,
			TotalItemsSold INTEGER,
            TotalReviews INTEGER
        )`,
		`CREATE TABLE IF NOT EXISTS Comments (
            CommentID SERIAL PRIMARY KEY,
            BuyerID INTEGER REFERENCES Users(UserID),
            Comment TEXT,
			ProductID INTEGER,
			SellerID INTEGER REFERENCES Users(UserID)
        )`,
        `CREATE TABLE IF NOT EXISTS Products (
            ProductID SERIAL PRIMARY KEY,
            Title VARCHAR(255),
            Description TEXT,
            Price NUMERIC(10, 2),
            CategoryID INTEGER,
            SellerID INTEGER REFERENCES Users(UserID),
            Condition VARCHAR(50),
            PutOutDate DATE,
            ProductLocation TEXT,
            ProductDetails TEXT,
			Status status,
            ImageUrl TEXT,
            Views INTEGER
        )`,
        `CREATE TABLE IF NOT EXISTS Orders (
            OrderID SERIAL PRIMARY KEY,
            SellerID INTEGER REFERENCES Users(UserID),
			BuyerID INTEGER REFERENCES Users(UserID),
            Date DATE,
			PriceTotal NUMERIC(10, 2)
        )`,
        `CREATE TABLE IF NOT EXISTS OrderProducts (
            DetailID SERIAL PRIMARY KEY,
            OrderID INTEGER REFERENCES Orders(OrderID),
			ProductID INTEGER REFERENCES Products(ProductID)
        )`,
		`CREATE TABLE IF NOT EXISTS Categories (
            CategoryID SERIAL PRIMARY KEY,
            CategoryName VARCHAR(50)
        )`,
    }

    // Execute all SQL commands.
    _, err := conn.Exec(context.Background(), "CREATE TYPE status AS ENUM ('available', 'sold')")
    if err != nil {
        if strings.Contains(err.Error(), "already exists") {
            // Ignore the error or log it as info because the type already exists
            log.Println("Info: The type 'status' already exists.")
        } else {
            // Handle other errors that might be critical
            log.Fatalf("Error creating type 'status': %v", err)
        }
    }
    for _, sql := range commands {
        _, err := conn.Exec(context.Background(), sql)
        if err != nil {
            log.Fatalf("Failed to execute SQL command: %s\nError: %v", sql, err)
        } else {
            fmt.Println("Table created successfully.")
        }
    }
}

func insertSampleData(conn *pgx.Conn) {
    // Insert users
    for _, user := range model.Users {
        _, err := conn.Exec(context.Background(), `INSERT INTO Users (UserID, Username, UserEmail, UserPhone, Password, Address, ProfilePicture, RegisterDate, UserRating, TotalItemsSold, TotalReviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (UserID) DO NOTHING`, user.UserID, user.Username, user.UserEmail, user.UserPhone, user.Password, user.Address, user.ProfilePicture, user.RegisterDate, user.UserRating, user.TotalItemsSold, user.TotalReviews)
        if err != nil {
            log.Fatalf("Failed to insert user data: %v", err)
        }
    }
    fmt.Println("Users inserted successfully")

    // Insert comments
    for _, comment := range model.Comments {
        _, err := conn.Exec(context.Background(), `INSERT INTO Comments (CommentID, BuyerID, Comment, ProductID, SellerID) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (CommentID) DO NOTHING`, comment.CommentID, comment.BuyerID, comment.Comment, comment.ProductID, comment.SellerID)
        if err != nil {
            log.Fatalf("Failed to insert comment data: %v", err)
        }
    }
    fmt.Println("Comments inserted successfully")

    // Insert products
    for _, product := range model.Products {
        _, err := conn.Exec(context.Background(), `INSERT INTO Products (ProductID, Title, Description, Price, CategoryID, SellerID, Condition, PutOutDate, ProductLocation, ProductDetails, Status, ImageUrl, Views) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (ProductID) DO NOTHING`, product.ProductID, product.Title, product.Description, product.Price, product.CategoryID, product.SellerID, product.Condition, product.PutOutDate, product.ProductLocation, product.ProductDetails, product.Status, product.ImageUrl, product.Views)
        if err != nil {
            log.Fatalf("Failed to insert product data: %v", err)
        }
    }
    fmt.Println("Products inserted successfully")

    // Insert orders
    for _, order := range model.Orders {
        _, err := conn.Exec(context.Background(), `INSERT INTO Orders (OrderID, SellerID, BuyerID, Date, PriceTotal) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (OrderID) DO NOTHING`, order.OrderID, order.SellerID, order.BuyerID, order.Date, order.PriceTotal)
        if err != nil {
            log.Fatalf("Failed to insert order data: %v", err)
        }
    }
    fmt.Println("Orders inserted successfully")

    // Insert order details
    for _, detail := range model.OrderProducts {
        _, err := conn.Exec(context.Background(), `INSERT INTO OrderProducts (DetailID, OrderID, ProductID) VALUES ($1, $2, $3) ON CONFLICT (DetailID) DO NOTHING`, detail.DetailID, detail.OrderID, detail.ProductID)
        if err != nil {
            log.Fatalf("Failed to insert order detail data: %v", err)
        }
    }
    fmt.Println("Order details inserted successfully")

    // Insert categories
    for _, category := range model.Categories {
        _, err := conn.Exec(context.Background(), `INSERT INTO Categories (CategoryID, CategoryName) VALUES ($1, $2) ON CONFLICT (CategoryID) DO NOTHING`, category.CategoryID, category.CategoryName)
        if err != nil {
            log.Fatalf("Failed to insert category data: %v", err)
        }
    }
    fmt.Println("Categories inserted successfully")
}