package sqlMethods

import (
	"appBE/model"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
)

func connectDB() *pgx.Conn {
	// use pgx to connect to db
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		log.Fatal("DB_USER is not set in the environment variables")
	}
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		log.Fatal("DB_PASSWORD is not set in the environment variables")
	}
	dbURL := os.Getenv("DB_URL_LOCAL")
	if dbURL == "" {
		log.Fatal("DB_URL_LOCAL is not set in the environment variables")
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

	// defer close to continue useing
	conn := connectDB()
	defer conn.Close(context.Background())

	// if not empty then no need to create
	fmt.Println("initializing sql")
	createTables(conn)
	insertSampleData(conn)
	fmt.Println("sql initialization succeeded")
}

// func checkIfDBEmpty(conn *pgx.Conn) bool {
// 	var exists string
// 	// if string is not empty, then db is not empty
// 	err := conn.QueryRow(context.Background(), "SELECT to_regclass('public.users')").Scan(&exists)
// 	if err != nil {
// 		if err == pgx.ErrNoRows {
// 			return true // Table does not exist
// 		}
// 		log.Printf("Error checking if table exists: %v\n", err)
// 		return true // Assume DB is empty if there's an error
// 	}
// 	if exists == "" {
// 		return true // to_regclass returns NULL, which is scanned as an empty string
// 	}
// 	return false
// }

func createTables(conn *pgx.Conn) {
	// create sql tables
	commands := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
		`CREATE TABLE IF NOT EXISTS UserAuth (
            Username VARCHAR(50) PRIMARY KEY NOT NULL,
            EncodedPassword VARCHAR(255) NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS UserInfo (
            UserID BIGSERIAL PRIMARY KEY NOT NULL,
            Username VARCHAR(50) REFERENCES UserAuth(Username) NOT NULL,
            UserEmail VARCHAR(255) NOT NULL,
            UserPhone VARCHAR(20),
            Nickname VARCHAR(50),
            ProfilePicture VARCHAR(255),
            RegisterTime TIMESTAMP WITH TIME ZONE NOT NULL,
            TotalViews BIGINT NOT NULL,
            TotalComments BIGINT NOT NULL,
            TotalLikes BIGINT NOT NULL,
            UserExperience BIGINT NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS Categories (
            CategoryID BIGSERIAL PRIMARY KEY NOT NULL,
            CategoryName VARCHAR(50) NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS Posts (
            PostID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            Title VARCHAR(255) NOT NULL,
            Description VARCHAR(255) NOT NULL,
            Likes BIGINT NOT NULL,
            CategoryID BIGINT REFERENCES Categories(CategoryID) NOT NULL,
            PostOwnerID BIGINT REFERENCES UserInfo(UserID) NOT NULL,
            PutOutTime TIMESTAMP WITH TIME ZONE NOT NULL,
            PostDetails VARCHAR(1000),
            IsAvailable BOOLEAN NOT NULL,
            ImageUrl VARCHAR(255),
            Views BIGINT NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS Comments (
            CommentID BIGSERIAL PRIMARY KEY NOT NULL,
            PosterID BIGINT REFERENCES UserInfo(UserID) NOT NULL,
            Comment VARCHAR(1000) NOT NULL,
            PostID UUID REFERENCES Posts(PostID) NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS SubComments (
            SubCommentID BIGSERIAL PRIMARY KEY NOT NULL,
            PosterID BIGINT REFERENCES UserInfo(UserID) NOT NULL,
            Comment VARCHAR(1000) NOT NULL,
            CommentID BIGINT REFERENCES Comments(CommentID) NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS Likes (
            LikeID BIGSERIAL PRIMARY KEY NOT NULL,
            PostID UUID REFERENCES Posts(PostID) NOT NULL,
            Liker BIGINT REFERENCES UserInfo(UserID) NOT NULL,
            DateTime TIMESTAMP WITH TIME ZONE NOT NULL
        )`,
	}

	// Execute all SQL commands.

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
	// Insert Auth
	for _, auth := range model.Auths {
		_, err := conn.Exec(context.Background(), `INSERT INTO UserAuth (
            Username, EncodedPassword) VALUES ($1, $2) 
            ON CONFLICT (Username) DO NOTHING`, auth.Username, auth.EncodedPassword)
		if err != nil {
			log.Fatalf("Failed to insert auth data: %v", err)
		}
	}
	fmt.Println("Users inserted successfully")
	// Insert users
	for _, user := range model.Users {
		_, err := conn.Exec(context.Background(), `INSERT INTO UserInfo (UserID, 
            Username, UserEmail, UserPhone, Nickname,ProfilePicture, RegisterTime, 
			TotalViews, TotalComments, TotalLikes, 
            UserExperience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            ON CONFLICT (UserID) DO NOTHING`, user.UserID, user.Username, user.UserEmail,
			user.UserPhone, user.Nickname, user.ProfilePicture,
			user.RegisterTime, user.TotalViews, user.TotalComments, user.TotalLikes, user.UserExperience)
		if err != nil {
			log.Fatalf("Failed to insert user data: %v", err)
		}
	}
	fmt.Println("Userinfo inserted successfully")

	// Insert categories
	for _, category := range model.Categories {
		_, err := conn.Exec(context.Background(), `INSERT INTO Categories
        (CategoryID, CategoryName) VALUES ($1, $2) ON CONFLICT (CategoryID) 
        DO NOTHING`, category.CategoryID, category.CategoryName)
		if err != nil {
			log.Fatalf("Failed to insert category data: %v", err)
		}
	}
	fmt.Println("Categories inserted successfully")

	// Insert posts
	for _, post := range model.Posts {
		_, err := conn.Exec(context.Background(), `INSERT INTO Posts (PostID, 
            Title, Description, Likes, CategoryID, PostOwnerID, PutOutTime, 
            PostDetails, IsAvailable, ImageUrl, Views) VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            ON CONFLICT (PostID) DO NOTHING`, post.PostID, post.Title, post.Description,
			post.Likes, post.CategoryID, post.PostOwnerID, post.PutOutTime, post.PostDetails,
			post.IsAvailable, post.ImageUrl, post.Views)
		if err != nil {
			log.Fatalf("Failed to insert post data: %v", err)
		}
	}
	fmt.Println("Posts inserted successfully")

	// Insert comments
	for _, comment := range model.Comments {
		_, err := conn.Exec(context.Background(), `INSERT INTO Comments (CommentID, 
            PosterID, Comment, PostID) VALUES 
            ($1, $2, $3, $4) ON CONFLICT (CommentID) DO NOTHING`,
			comment.CommentID, comment.PosterID, comment.Comment, comment.PostID)
		if err != nil {
			log.Fatalf("Failed to insert comment data: %v", err)
		}
	}
	fmt.Println("Comments inserted successfully")

	// Insert sub-comments
	for _, subComment := range model.SubComments {
		_, err := conn.Exec(context.Background(), `INSERT INTO SubComments (SubCommentID, 
            PosterID, Comment, CommentID) VALUES 
            ($1, $2, $3, $4) ON CONFLICT (SubCommentID) DO NOTHING`,
			subComment.SubCommentID, subComment.PosterID, subComment.Comment, subComment.CommentID)
		if err != nil {
			log.Fatalf("Failed to insert sub-comment data: %v", err)
		}
	}
	fmt.Println("SubComments inserted successfully")

	// Insert likes
	for _, like := range model.Likes {
		_, err := conn.Exec(context.Background(), `INSERT INTO Likes (LikeID, 
            PostID, LikerID, DateTime) VALUES 
            ($1, $2, $3, $4) ON CONFLICT (LikeID) DO NOTHING`,
			like.LikeID, like.PostID, like.LikerID, like.DateTime)
		if err != nil {
			log.Fatalf("Failed to insert like data: %v", err)
		}
	}
	fmt.Println("Likes inserted successfully")
}
