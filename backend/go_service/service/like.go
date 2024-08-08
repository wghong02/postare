package service

import (
	sqlMethods "appBE/database"
	customErrors "appBE/errors"
	"appBE/model"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

func LikePost(body []byte, userID int64) error {

	// parse json body
	var like model.Like
	if err := json.Unmarshal(body, &like); err != nil {
		return customErrors.ErrUnableToParseJson
	}

	// process additional data
	like.Liker = userID
	like.DateTime = time.Now()

	if err := sqlMethods.SaveLikeToSQL(&like); err != nil {
		fmt.Printf("Failed to save like to SQL %v\n", err)
		return err
	}
	return nil
}

func UnlikePost(userID int64, postID uuid.UUID) error {
	
	// delete
	err := sqlMethods.DeleteLikeFromSQL(userID, postID)
	if err != nil {
		fmt.Printf("Failed to delete comment from SQL %v\n", err)
		return err
	}
	return nil
}

func CheckIfLikeExists(userID int64, postID uuid.UUID) (bool, error){
	var exists bool
	exists, err := sqlMethods.CheckIfLikeExistsBy(userID, postID)
	if err != nil {
        return false, err
    }
    return exists, nil
}