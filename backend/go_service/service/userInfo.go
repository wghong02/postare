package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"appBE/errors"
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
	
	// call backend to get the product information, return the product info and if there is error
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
