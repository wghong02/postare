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
			TotalItemsSold INTEGER
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
        `CREATE TABLE IF NOT EXISTS OrderDetails (
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
        _, err := conn.Exec(context.Background(), `INSERT INTO Users (UserID, Username, UserEmail, UserPhone, Password, Address, ProfilePicture, RegisterDate, UserRating, TotalItemsSold) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (UserID) DO NOTHING`, user.UserID, user.Username, user.UserEmail, user.UserPhone, user.Password, user.Address, user.ProfilePicture, user.RegisterDate, user.UserRating, user.TotalItemsSold)
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
    for _, detail := range model.OrderDetails {
        _, err := conn.Exec(context.Background(), `INSERT INTO OrderDetails (DetailID, OrderID, ProductID) VALUES ($1, $2, $3) ON CONFLICT (DetailID) DO NOTHING`, detail.DetailID, detail.OrderID, detail.ProductID)
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

func SaveProductToSQL(product *model.Product) error {
    // connect to db
    conn := connectDB()
    defer conn.Close(context.Background())

    // check if user exists
    var exists bool
    err := conn.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Users WHERE UserID = $1)", product.SellerID).Scan(&exists)
    if err != nil {
        return err
    }
    if !exists {
        return fmt.Errorf("seller with ID %d does not exist", product.SellerID)
    }

    // save product
    query := `INSERT INTO Products (Title, 
        Description, 
        Price, 
        CategoryID, 
        SellerID, 
        Condition, 
        PutOutDate, 
        ProductLocation, 
        ProductDetails, 
        Status, ImageUrl, Views) VALUES ($1, 
            $2, 
            $3, 
            $4, 
            $5, 
            $6, 
            $7, 
            $8, 
            $9, 
            $10, 
            $11,
            $12)`

    
    _, err = conn.Exec(context.Background(), 
    query, 
    product.Title, 
    product.Description, 
    product.Price, 
    product.CategoryID, 
    product.SellerID, 
    product.Condition, 
    product.PutOutDate, 
    product.ProductLocation, 
    product.ProductDetails, 
    product.Status, 
    product.ImageUrl,
    product.Views)

    return err
}

func SearchProductsByDescription(keyword string, limit int, offset int) ([]model.Product, error) {
    // connect to db
    conn := connectDB()
    defer conn.Close(context.Background())

    var products []model.Product
    var query string
    var args []interface{}
    
    // use args to avoid sql injection
	if keyword == "" {
        query = `SELECT * FROM Products LIMIT $1 OFFSET $2`
        args = append(args, limit, offset)
    } else {
        query = `SELECT * FROM Products WHERE title LIKE $1 OR description LIKE $1 LIMIT $2 OFFSET $3`
        args = append(args, "%"+keyword+"%", limit, offset)
    }

    // search with sql statement
    rows, err := conn.Query(context.Background(), query, args...)
    if err != nil {
        fmt.Println(err)
        return nil, err
    }
    defer rows.Close()

    // add to result
    for rows.Next() {
        var product model.Product
        err := rows.Scan(&product.ProductID, 
            &product.Title, 
            &product.Description, 
            &product.Price,
            &product.CategoryID,
            &product.SellerID,
            &product.Condition,
            &product.PutOutDate,
            &product.ProductLocation,
            &product.ProductDetails,
            &product.Status,
            &product.ImageUrl,
            &product.Views,
        )
        if err != nil {
            return nil, err
        }
        products = append(products, product)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return products, nil
}

func SearchProductByID(productID int64) (model.Product, error) {
    // connect to db
    conn := connectDB()
    defer conn.Close(context.Background())

    // search if product id exists
    var product model.Product
	err := conn.QueryRow(context.Background(), `SELECT ProductID, Title, Description, Price, CategoryID, SellerID, Condition, PutOutDate, ProductLocation, ProductDetails, Status, ImageUrl, Views FROM Products WHERE ProductID=$1`, productID).Scan(
        &product.ProductID, 
        &product.Title, 
        &product.Description, 
        &product.Price,
        &product.CategoryID,
        &product.SellerID,
        &product.Condition,
        &product.PutOutDate,
        &product.ProductLocation,
        &product.ProductDetails,
        &product.Status,
        &product.ImageUrl,
        &product.Views,
    )

    // Check if the query returned an error
    if err != nil {
        if err == pgx.ErrNoRows {
            return model.Product{}, fmt.Errorf("no product found with ID %d", productID)
        }
        return model.Product{}, err // Return other errors that might have occurred
    }

    return product, nil
}

func SearchUserByName(username string) (bool, error) {
    conn := connectDB()
    defer conn.Close(context.Background())

    // check if user exists
    var exists bool
    err := conn.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Users WHERE Username = $1)", username).Scan(&exists)
    if err != nil {
        return false, err
    }

    return exists, nil
}

func SaveUserToSQL(user *model.User) (bool, error) {
    conn := connectDB()
    defer conn.Close(context.Background())

    // save user
    query := `INSERT INTO Users (Username, UserEmail, UserPhone, Password, Address, ProfilePicture, RegisterDate, UserRating, TotalItemsSold) VALUES ($1, 
            $2, $3, $4, $5, $6, $7,  $8, $9)`

    _, err := conn.Exec(context.Background(), 
    query, user.Username, user.UserEmail, user.UserPhone, user.Password, user.Address, user.ProfilePicture, user.RegisterDate, user.UserRating, user.TotalItemsSold)
    if err != nil {
        return false, err
    }

    return true, nil
}


func CheckUser(username string, password string) (bool, error) {
    conn := connectDB()
    defer conn.Close(context.Background())

    // get the true password
    var truePassword string
    err := conn.QueryRow(context.Background(), "SELECT Password FROM Users WHERE Username=$1", username).Scan(&truePassword)
    if err != nil {
        return false, err
    }

    return password==truePassword, nil
}

func GetUserID(username string) (int64){
    conn := connectDB()
    defer conn.Close(context.Background())

    // get user id from db
    var userID int64
    conn.QueryRow(context.Background(), "SELECT UserID FROM Users WHERE Username=$1", username).Scan(&userID)

    return userID
}

func DeleteProductFromSQL(productID int64, userID int64) error {
    conn := connectDB()
    defer conn.Close(context.Background())

    // delete from db
    _, err := conn.Exec(context.Background(), "DELETE FROM Products WHERE ProductID=$1", productID)
    if err != nil{
        return err
    }
    return nil
}