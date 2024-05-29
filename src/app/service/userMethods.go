package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
)

func RegisterUser(user *model.User) (bool, error) {
	exists, err := sqlMethods.SearchUser(user.Username)
	if err != nil {
		return false, err
	}
	if exists {
        return false, nil
    }
	return sqlMethods.SaveUserToSQL(user)
}

func ValidateUser(username string, password string) (bool, int64, error) {
	exists, err := sqlMethods.SearchUser(username)
	if err != nil {
		return false, 0, err
	}
	if !exists {
        return false, 0, err
    }
	success, err := sqlMethods.CheckUser(username, password)
	userID := sqlMethods.GetUserID(username)
    return success, userID, err
}