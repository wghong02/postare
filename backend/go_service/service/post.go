package service

import (
	sqlMethods "appBE/database"
	"appBE/errors"
	"appBE/model"
	"fmt"
	"time"

	"github.com/google/uuid"
)

func UploadPost(post *model.Post, userID int64) error {
	// Set additional fields

	exists, err := checkIfUserExistByID(userID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.ErrUserNotFound
	}

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

func CheckIfPostPostedByUser(postID uuid.UUID, userID int64) (bool, error) {
    post, err := GetPostByID(postID)
    if err != nil {
        return false, fmt.Errorf("failed to search post by ID: %v", err)
    }

    if post.PostOwnerID == userID {
        return true, nil
    }
    return false, nil
}

func DeletePost(postID uuid.UUID, userID int64) error {
	// first check if post exists
	exists, err := sqlMethods.CheckIfPostExistByID(postID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.ErrPostNotFound
	}
	// then verify that the post is owned by the user
	postedByUser, err := CheckIfPostPostedByUser(postID, userID)
	if err != nil {
		return err
	}
	if !postedByUser {
		return errors.ErrPostNotOwnedByUser
	}
	// call backend to delete the post, return if there is error
	if err = sqlMethods.DeletePostFromSQL(postID, userID); err != nil {
		fmt.Printf("Failed to delete post from SQL %v\n", err)
		return err
	}
	return nil
}

func SearchPostsByDescription(description string, batch int, totalSize int) ([]model.Post, error) {
	// call backend to get posts by description
	// totalSize is the total number of products to load from the server
	// batch k determines the kth number of batch to load in to the client
	// if no keywords given, return the first totalSize products
	offset := (batch - 1) * totalSize
	posts, err := sqlMethods.SearchPostsByDescription(description, totalSize, offset)
	if err != nil {
		fmt.Printf("Failed to search posts from SQL, %v\n", err)
		return nil, err
	}
	return posts, err
}

func GetPostByID(postID uuid.UUID) (model.Post, error) {
	// call backend to get the post information, return the post info and if there is error
	exists, err := sqlMethods.CheckIfPostExistByID(postID)
	if err != nil {
		return model.Post{}, err
	}
	if !exists {
		return model.Post{}, errors.ErrPostNotFound
	}
	post, err := sqlMethods.GetPostByID(postID)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return model.Post{}, err
	}
	return post, err
}

func GetMostViewedPosts(batch int, totalSize int) ([]model.Post, error) {
	// Calculate offset based on batch and totalSize
	offset := (batch - 1) * totalSize

	// Call backend to get the most viewed posts
	posts, err := sqlMethods.GetMostViewedPosts(totalSize, offset)
	if err != nil {
		fmt.Printf("Failed to search posts from SQL, %v\n", err)
		return nil, err
	}
	return posts, err
}


func GetPostsByUserID(userID int64, batch int, totalSize int) ([]model.Post, error) {

	exists, err := checkIfUserExistByID(userID)
	if err != nil {
		return []model.Post{}, err
	}
	if !exists {
		return []model.Post{}, errors.ErrUserNotFound
	}

	// Calculate offset based on batch and totalSize
	offset := (batch - 1) * totalSize

	// Call backend to get the posts information, return the post info and if there is error
	posts, err := sqlMethods.SearchPostsByUserID(userID, totalSize, offset)
	if err != nil {
		fmt.Printf("Failed to search user posts from SQL, %v\n", err)
		return []model.Post{}, err
	}
	return posts, err
}