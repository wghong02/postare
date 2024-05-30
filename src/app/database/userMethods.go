package sqlMethods

import (
	"appBE/model"
	"context"
	"fmt"

	"github.com/jackc/pgx/v4"
)

func SearchUserExistByName(username string) (bool, error) {
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

func GetUserIDByName(username string) (int64){
    conn := connectDB()
    defer conn.Close(context.Background())

    // get user id from db
    var userID int64
    conn.QueryRow(context.Background(), "SELECT UserID FROM Users WHERE Username=$1", username).Scan(&userID)

    return userID
}

func SearchUserByID(userID int64) (model.User, error) {
    // connect to db
    conn := connectDB()
    defer conn.Close(context.Background())

    // search if product id exists
    var user model.User
	err := conn.QueryRow(context.Background(), `SELECT UserID, Username, UserEmail, UserPhone, Password, Address, ProfilePicture, RegisterDate, UserRating, TotalItemsSold FROM Users WHERE UserID = $1`, userID).Scan(
        &user.UserID, 
        &user.Username, 
        &user.UserEmail, 
        &user.UserPhone,
        &user.Password,
        &user.Address,
        &user.ProfilePicture,
        &user.RegisterDate,
        &user.UserRating,
        &user.TotalItemsSold,
    )

    // Check if the query returned an error
    if err != nil {
        if err == pgx.ErrNoRows {
            return model.User{}, fmt.Errorf("no user found with ID %d", userID)
        }
        return model.User{}, err // Return other errors that might have occurred
    }

    return user, nil
}