package service

import (
	sqlMethods "appBE/database"
	customErrors "appBE/errors"
	"appBE/model"
	"bytes"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

func SaveUserInfo(body []byte) error {

	// Decode the body into a User struct
	var user model.UserInfo
	if err := json.Unmarshal(body, &user); err != nil {
		return customErrors.ErrUnableToParseJson
	}

	// all users start with default pfp
	default_use_pfp_url := "https://postarebasket.s3.us-east-2.amazonaws.com/default_use_pfp.jpg"

	user.RegisterTime = time.Now()
	user.TotalViews = 0
	user.TotalComments = 0
	user.TotalLikes = 0
	user.UserExperience = 0
	user.ProfilePicture = &default_use_pfp_url

	// Save post to the database
	if err := sqlMethods.SaveUserInfoToSQL(&user); err != nil {
		fmt.Printf("Failed to save userinfo to SQL %v\n", err)
		return err
	}
	return nil
}

func UpdateUserInfo(userID int64, userEmail, userPhone, userNickname, bio string, buf bytes.Buffer, fileHeader *multipart.FileHeader) error {

	// Convert buffer to io.ReadSeeker, upload the post's image to S3 for better storage
	fileReader := bytes.NewReader(buf.Bytes())
	
	// upload the pfp to aws s3 for storage
	imageURL, err := uploadToS3(fileReader, fileHeader.Filename)
	if err != nil {
		return customErrors.ErrUnableToUploadToS3
	}

	// construct the user model with the given info
	user := model.UserInfo{
		UserID: userID,
		UserEmail: userEmail,
		UserPhone: &userPhone,
		Nickname: userNickname,
		Bio: &bio,
		ProfilePicture: &imageURL,
	}

	// Save post to the database
	if err := sqlMethods.UpdateUserInfo(&user); err != nil {
		fmt.Printf("Failed to update userinfo to SQL %v\n", err)
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

func GetLikedUsersByPostID(postID uuid.UUID, limit int, offset int) ([] model.UserInfo, error) {
	// call backend to get the users information, return the users info and if there is error

	users, err := sqlMethods.GetLikedUsersByPostID(postID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search likes by postID from SQL, %v\n", err)
		return []model.UserInfo{}, err
	}
	return users, err
}