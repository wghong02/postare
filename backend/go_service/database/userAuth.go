package sqlMethods

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