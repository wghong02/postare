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

func DeleteComment(commmetID int64, userID int64) error {
	// check if posted by the user
	postedByUser, err := sqlMethods.CheckIfCommentOwnedByUser(commmetID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrCommentNotOwnedByUser
	}
	
	// delete
	err = sqlMethods.DeleteCommentFromSQL(commmetID)
	if err != nil {
		fmt.Printf("Failed to delete comment from SQL %v\n", err)
		return err
	}
	return nil
}

func DeleteSubComment(subcommmetID int64, userID int64) error {
	// check if posted by the user
	postedByUser, err := sqlMethods.CheckIfSubCommentOwnedByUser(subcommmetID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrSubCommentNotOwnedByUser
	}

	// delete
	err = sqlMethods.DeleteSubCommentFromSQL(subcommmetID)
	if err != nil {
		fmt.Printf("Failed to delete comment from SQL %v\n", err)
		return err
	}
	return nil
}

func GetCommentsByPostID(postID uuid.UUID, limit int, offset int) ([] model.Comment, error) {
	// call backend to get the post information, return the post info and if there is error

	comments, err := sqlMethods.GetCommentsByPostID(postID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return []model.Comment{}, err
	}
	return comments, err
}

func GetSubCommentsByCommentID(commentID int64, limit int, offset int) ([] model.SubComment, error) {
	// call backend to get the post information, return the post info and if there is error

	subComments, err := sqlMethods.GetSubCommentsByCommentID(commentID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return []model.SubComment{}, err
	}
	return subComments, err
}