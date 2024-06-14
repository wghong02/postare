package service

// func RegisterUser(user *model.User) (bool, error) {
// 	// search users first to see if they exists. only register if not exist
// 	exists, err := sqlMethods.SearchUserExistByName(user.Username)
// 	if err != nil {
// 		return false, err
// 	}
// 	if exists {
//         return false, nil
//     }
// 	// use backend to save the user's data
// 	return sqlMethods.SaveUserToSQL(user)
// }

// func ValidateUser(username string, password string) (bool, int64, error) {
// 	// search users first to see if they exists. only validate if exist
// 	exists, err := sqlMethods.SearchUserExistByName(username)
// 	if err != nil {
// 		return false, 0, err
// 	}
// 	if !exists {
//         return false, 0, err
//     }
// 	// use backend to check if user exists, and return user's corresponding ID with validation result
// 	success, err := sqlMethods.CheckUser(username, password)
// 	userID := sqlMethods.GetUserIDByName(username)
//     return success, userID, err
// }