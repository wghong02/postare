package sqlMethods

import (
	customErrors "appBE/errors"
	"appBE/model"
	"context"
	"errors"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

func SaveUserInfoToSQL(user *model.UserInfo) error {
	
	// save user
	query := `INSERT INTO UserInfo (Username, UserEmail, UserPhone, Nickname,
        ProfilePicture, RegisterTime, TotalViews, TotalComments,
        TotalLikes, UserExperience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	_, err := dbPool.Exec(context.Background(),
		query, user.Username, user.UserEmail, user.UserPhone, user.Nickname,
		user.ProfilePicture, user.RegisterTime, user.TotalViews,
		user.TotalComments, user.TotalLikes, user.UserExperience)
	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
            // 23505 is the unique violation error code in PostgreSQL
            return customErrors.ErrUsernameAlreadyExists
        }
		return err
	}

	return nil
}

func GetUserInfoByID(userID int64) (model.UserInfo, error) {
	// search if user id exists
	var user model.UserInfo
	err := dbPool.QueryRow(context.Background(),
		`SELECT UserID, Username, UserEmail, UserPhone, Nickname,
    ProfilePicture, RegisterTime, TotalViews, TotalComments, TotalLikes, 
    UserExperience, TotalPosts FROM UserInfo WHERE UserID = $1`,
		userID).Scan(&user.UserID, &user.Username, &user.UserEmail,
		&user.UserPhone, &user.Nickname, &user.ProfilePicture,
		&user.RegisterTime, &user.TotalViews, &user.TotalComments,
		&user.TotalLikes, &user.UserExperience, &user.TotalPosts,
	)

	// Check if the query returned an error
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
            return model.UserInfo{}, customErrors.ErrUserNotFound
        }
		return model.UserInfo{}, err 
	}

	return user, nil
}

func GetUserIDByUsername(username string) (int64, error) {

	// search if user id exists
	var userID int64
	err := dbPool.QueryRow(context.Background(),
		`SELECT UserID FROM UserInfo WHERE Username = $1`,
		username).Scan(&userID)

	// Check if the query returned an error
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
            return -1, customErrors.ErrUserNotFound
        }
		return -1, err 
	}

	return userID, nil
}

func GetUsernameByUserID(userID int64) (string, error) {

	// search if user id exists
	var username string
	err := dbPool.QueryRow(context.Background(),
		`SELECT Username FROM UserInfo WHERE UserID = $1`,
		userID).Scan(&username)

	// Check if the query returned an error
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
            return "", customErrors.ErrUserNotFound
        }
		return "", err 
	}

	return username, nil
}

func checkIfUserExistsByID(userID int64) (bool, error) {
    var exists bool
    err := dbPool.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM UserInfo WHERE UserID=$1)", userID).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}