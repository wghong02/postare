package service

import (
	sqlMethods "appBE/database"
	customErrors "appBE/errors"
	"appBE/model"
	"fmt"
	"time"

	"github.com/google/uuid"
)

func UploadComment(comment *model.Comment, userID int64) error {
	// process additional data
	comment.PosterID = userID
	comment.CommentTime = time.Now()

	if err := sqlMethods.SaveCommentToSQL(comment); err != nil {
		fmt.Printf("Failed to save comment to SQL %v\n", err)
		return err
	}
	return nil
}

func UploadSubComment(subComment *model.SubComment, userID int64) error {
	// process additional data
	subComment.PosterID = userID
	subComment.CommentTime = time.Now()

	if err := sqlMethods.SaveSubCommentToSQL(subComment); err != nil {
		fmt.Printf("Failed to save subComment to SQL %v\n", err)
		return err
	}
	return nil
}

func DeleteComment(commentID int64, userID int64) error {
	// check if posted by the user
	postedByUser, err := sqlMethods.CheckIfCommentOwnedByUser(commentID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrCommentNotOwnedByUser
	}
	
	// delete
	err = sqlMethods.DeleteCommentFromSQL(commentID)
	if err != nil {
		fmt.Printf("Failed to delete comment from SQL %v\n", err)
		return err
	}
	return nil
}

func DeleteSubComment(subcommentID int64, userID int64) error {
	// check if posted by the user
	postedByUser, err := sqlMethods.CheckIfSubCommentOwnedByUser(subcommentID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrSubCommentNotOwnedByUser
	}

	// delete
	err = sqlMethods.DeleteSubCommentFromSQL(subcommentID)
	if err != nil {
		fmt.Printf("Failed to delete comment from SQL %v\n", err)
		return err
	}
	return nil
}

func GetCommentsByPostID(postID uuid.UUID, limit int, offset int) ([] model.Comment, error) {
	// call backend to get the post information, return the comment info and if there is error

	comments, err := sqlMethods.GetCommentsByPostID(postID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return []model.Comment{}, err
	}
	return comments, err
}

func GetSubCommentsByCommentID(commentID int64, limit int, offset int) ([] model.SubComment, error) {
	// call backend to get the post information, return the sub comment info and if there is error

	subComments, err := sqlMethods.GetSubCommentsByCommentID(commentID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return []model.SubComment{}, err
	}
	return subComments, err
}

func GetCommentCountByPostID(postID uuid.UUID, isTotal bool) (model.CountModel, error){
	// get the total comment or comment + replies count of a given post
	var count int64
	var err error
	if isTotal { // to track the total of comments and subcomments
		count, err = sqlMethods.GetTotalCommentCountByPostID(postID)
	} else {
		count, err = sqlMethods.GetCommentCountByPostID(postID)
	}
	result := model.CountModel{}
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return result, err
	}
	result.Count = count
	return result, err
}

func GetSubCommentCountByCommentID(commentID int64) (model.CountModel, error){
	// get the total replies count of a given comment
	count, err := sqlMethods.GetSubCommentCountByCommentID(commentID)
	result := model.CountModel{}
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return result, err
	}
	result.Count = count
	return result, err
}