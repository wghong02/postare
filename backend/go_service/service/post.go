package service

import (
	sqlMethods "appBE/database"
	customErrors "appBE/errors"
	"appBE/model"
	"fmt"
	"time"

	"github.com/google/uuid"
)

func UploadPost(post *model.Post, userID int64) error {
	// Set additional fields
	post.PostID = uuid.New()
	post.PostOwnerID = userID
	post.PutOutTime = time.Now()
	post.Likes = 0
	post.Views = 0
	post.IsAvailable = true

	// Save post to the database
	if err := sqlMethods.SavePostToSQL(post); err != nil {
		fmt.Printf("Failed to save post to SQL %v\n", err)
		return err
	}
	return nil
}

func DeletePost(postID uuid.UUID, userID int64) error {
	// verify that the post is owned by the user
	postedByUser, err := sqlMethods.CheckIfPostOwnedByUser(postID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrPostNotOwnedByUser
	}
	// call backend to delete the post, return if there is error
	if err = sqlMethods.DeletePostFromSQL(postID); err != nil {
		fmt.Printf("Failed to delete post from SQL %v\n", err)
		return err
	}
	return nil
}

func SearchPostsByDescription(description string, limit int, offset int) ([]model.Post, error) {
	// call backend to get posts by description
	
	posts, err := sqlMethods.SearchPostsByDescription(description, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search posts from SQL, %v\n", err)
		return nil, err
	}
	return posts, err
}

func GetPostByID(postID uuid.UUID) (model.Post, error) {
	// call backend to get the post information, return the post info and if there is error

	post, err := sqlMethods.GetPostByID(postID)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return model.Post{}, err
	}
	return post, err
}

func GetMostInOneAttributePosts(limit int, offset int, attribute string) ([]model.Post, error) {

	// Call backend to get the most viewed posts
	posts, err := sqlMethods.GetMostInOneAttributePosts(limit, offset, attribute)
	if err != nil {
		fmt.Printf("Failed to search posts from SQL, %v\n", err)
		return nil, err
	}
	return posts, err
}


func GetPostsByUserID(userID int64, limit int, offset int) ([]model.Post, error) {

	// Call backend to get the posts information, return the post info and if there is error
	posts, err := sqlMethods.SearchPostsByUserID(userID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search user posts from SQL, %v\n", err)
		return []model.Post{}, err
	}
	return posts, err
}