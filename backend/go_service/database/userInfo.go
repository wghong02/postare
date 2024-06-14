package sqlMethods

import (
	"appBE/model"
	"context"
)

func GetUserIDByUsername(username string) int64 {
	conn := connectDB()
	defer conn.Close(context.Background())

	// get user id from db
	var userID int64
	conn.QueryRow(context.Background(),
		"SELECT UserID FROM UserInfo WHERE Username=$1",
		username).Scan(&userID)

	return userID
}

func CheckIfUserExistByName(username string) (bool, error) {
	conn := connectDB()
	defer conn.Close(context.Background())

	// check if user exists
	var exists bool
	err := conn.QueryRow(context.Background(),
		"SELECT EXISTS(SELECT 1 FROM UserInfo WHERE Username = $1)",
		username).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func CheckIfUserExistByID(userID int64) (bool, error) {
	conn := connectDB()
	defer conn.Close(context.Background())

	// check if user exists
	var exists bool
	err := conn.QueryRow(context.Background(),
		"SELECT EXISTS(SELECT 1 FROM UserInfo WHERE UserID = $1)",
		userID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func GetUserInfoByID(userID int64) (model.UserInfo, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if user id exists
	var user model.UserInfo
	err := conn.QueryRow(context.Background(),
		`SELECT UserID, Username, UserEmail, UserPhone, Nickname,
    ProfilePicture, RegisterTime, TotalViews, TotalComments, TotalLikes, 
    UserExperience FROM UserInfo WHERE UserID = $1`,
		userID).Scan(&user.UserID, &user.Username, &user.UserEmail,
		&user.UserPhone, &user.Nickname, &user.ProfilePicture,
		&user.RegisterTime, &user.TotalViews, &user.TotalComments,
		&user.TotalLikes, &user.UserExperience,
	)

	// Check if the query returned an error
	if err != nil {

		return model.UserInfo{}, err 
	}

	return user, nil
}

func GetUserIdByName(username string) (int64, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if user id exists
	var userID int64
	err := conn.QueryRow(context.Background(),
		`SELECT UserID FROM UserInfo WHERE Username = $1`,
		username).Scan(&userID)

	// Check if the query returned an error
	if err != nil {

		return -1, err 
	}

	return userID, nil
}
