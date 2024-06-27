package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"fmt"
	"time"
)

func SaveUserInfo(user *model.UserInfo) error {

	// all users start with default pfp
	default_use_pfp_url := "https://postarebasket.s3.us-east-2.amazonaws.com/default_use_pfp.jpg"

	user.RegisterTime = time.Now()
	user.TotalViews = 0
	user.TotalComments = 0
	user.TotalLikes = 0
	user.UserExperience = 0
	user.ProfilePicture = &default_use_pfp_url

	// Save post to the database
	if err := sqlMethods.SaveUserInfoToSQL(user); err != nil {
		fmt.Printf("Failed to save post to SQL %v\n", err)
		return err
	}
	return nil
}

func GetUserInfoByID(userID int64) (model.UserInfo, error) {
	
	// call backend to get the user information, return the user info and if there is error

	user, err := sqlMethods.GetUserInfoByID(userID)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return model.UserInfo{}, err
	}
	return user, err
}

func GetUserIDByName(username string) (int64, error) {
	
	// call backend to get the post information, return the post info and if there is error
	userID, err := sqlMethods.GetUserIDByUsername(username)
	if err != nil {
		fmt.Printf("Failed to search user by name from SQL, %v\n", err)
		return -1, err
	}
	return userID, nil
}

func GetUsernameByID(userID int64) (string, error) {
	
	// call backend to get the post information, return the post info and if there is error
	username, err := sqlMethods.GetUsernameByUserID(userID)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return "", err
	}
	return username, nil
}