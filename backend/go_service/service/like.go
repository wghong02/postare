package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"fmt"
	"time"

	"github.com/google/uuid"
)

func LikePost(like *model.Like, userID int64) error {
	// process additional data
	like.Liker = userID
	like.DateTime = time.Now()

	if err := sqlMethods.SaveLikeToSQL(like); err != nil {
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

func GetLikesByPostID(postID uuid.UUID, limit int, offset int) ([] model.Like, error) {
	// call backend to get the post information, return the like info and if there is error

	likes, err := sqlMethods.GetLikesByPostID(postID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search likes by postID from SQL, %v\n", err)
		return []model.Like{}, err
	}
	return likes, err
}

func CheckIfLikeExists(userID int64, postID uuid.UUID) (bool, error){
	var exists bool
	exists, err := sqlMethods.CheckIfLikeExistsBy(userID, postID)
	if err != nil {
        return false, err
    }
    return exists, nil
}

func GetLikesByUserID(userID int64, limit int, offset int) ([] model.Like, error) {
	// call backend to get the post information, return the like info and if there is error

	likes, err := sqlMethods.GetLikesByUserID(userID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search likes by userID from SQL, %v\n", err)
		return []model.Like{}, err
	}
	return likes, err
}

func GetLikesCountByPostID(postID uuid.UUID) (model.CountModel, error){
	// get the total number of likes of a post

	var count int64
	var err error
	
	count, err = sqlMethods.GetTotalLikeCountByPostID(postID)
	
	result := model.CountModel{}
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return result, err
	}
	result.Count = count
	return result, err
}