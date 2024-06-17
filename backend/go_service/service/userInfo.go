package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"fmt"
	"time"
)

func SaveUserInfo(user *model.UserInfo) error {

	user.RegisterTime = time.Now()
	user.TotalViews = 0
	user.TotalComments = 0
	user.TotalLikes = 0
	user.UserExperience = 0

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

func GetUserIdByName(username string) (int64, error) {
	
	// call backend to get the product information, return the product info and if there is error
	userID, err := sqlMethods.GetUserIDByUsername(username)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return -1, err
	}
	return userID, nil
}
