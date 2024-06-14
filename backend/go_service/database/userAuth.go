package sqlMethods

// func SaveUserToSQL(user *model.User) (bool, error) {
// 	conn := connectDB()
// 	defer conn.Close(context.Background())

// 	// save user
// 	query := `INSERT INTO Users (Username, UserEmail, UserPhone, Nickname,
//         EncodedPassword, ProfilePicture, RegisterTime, TotalViews, TotalComments,
//         TotalLikes, UserExperience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

// 	_, err := conn.Exec(context.Background(),
// 		query, user.Username, user.UserEmail, user.UserPhone, user.Nickname,
// 		user.EncodedPassword, user.ProfilePicture, user.RegisterTime, user.TotalViews,
// 		user.TotalComments, user.TotalLikes, user.UserExperience)
// 	if err != nil {
// 		return false, err
// 	}

// 	return true, nil
// }

// func CheckUser(username string, password string) (bool, error) {
// 	conn := connectDB()
// 	defer conn.Close(context.Background())

// 	// get the true password
// 	var truePassword string
// 	err := conn.QueryRow(context.Background(),
// 		"SELECT EncodedPassword FROM Users WHERE Username=$1",
// 		username).Scan(&truePassword)
// 	if err != nil {
// 		return false, err
// 	}

// 	return password == truePassword, nil
// }