package service

import (
	sqlMethods "appBE/database"
	"appBE/errors"
	"appBE/model"
	"fmt"
)

func checkIfUserExistByName(username string) (bool, error) {
	exists, err := sqlMethods.CheckIfUserExistByName(username)
	if err != nil {
		fmt.Printf("Failed to search user by name from SQL, %v\n", err)
		return false, err
	}
	return exists, nil
}

func checkIfUserExistByID(userID int64) (bool, error) {
	exists, err := sqlMethods.CheckIfUserExistByID(userID)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return false, err
	}
	return exists, nil
}

func GetUserInfoByID(userID int64) (model.UserInfo, error) {
	
	// call backend to get the user information, return the user info and if there is error
	exists, err := checkIfUserExistByID(userID)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return model.UserInfo{}, err
	}
	if !exists {
		return model.UserInfo{}, errors.ErrUserNotFound
	}
	user, err := sqlMethods.GetUserInfoByID(userID)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return model.UserInfo{}, err
	}
	return user, err
}

func GetUserIdByName(username string) (int64, error) {
	
	// call backend to get the product information, return the product info and if there is error
	exists, err := checkIfUserExistByName(username)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return -1, err // -1 is error
	}
	if !exists {
		return -1, errors.ErrUserNotFound
	}
	userID, err := sqlMethods.GetUserIdByName(username)
	if err != nil {
		fmt.Printf("Failed to search user by id from SQL, %v\n", err)
		return -1, err
	}
	return userID, nil
}
