package service

import (
	sqlMethods "appBE/database"
	customErrors "appBE/errors"
	"appBE/model"
	"bytes"
	"fmt"
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

func UploadPost(userID int64, title, description, postDetails string, buf bytes.Buffer, fileHeader *multipart.FileHeader) error {

		
	// Convert buffer to io.ReadSeeker, upload the post's image to S3 for better storage
	fileReader := bytes.NewReader(buf.Bytes())
	
	imageURL, err := uploadToS3(fileReader, fileHeader.Filename)

	if err != nil {
		return customErrors.ErrUnableToUploadToS3
	}

	// construct the post
	post := model.Post{
		Title:       title,
		Description: description,
		ImageUrl:    imageURL,
		PostDetails: postDetails,
		PostID: uuid.New(),
		PostOwnerID: userID,
		PutOutTime: time.Now(),
		Likes: 0,
		Views: 0,
		IsAvailable: true,
		CategoryID: 3,
	}

	// Set additional fields

	// Save post to the database
	if err := sqlMethods.SavePostToSQL(&post); err != nil {
		fmt.Printf("Failed to save post to SQL %v\n", err)
		return err
	}
	return nil
}

func DeletePost(postID uuid.UUID, userID int64) (error) {
	// verify that the post is owned by the user
	postedByUser, err := sqlMethods.CheckIfPostOwnedByUser(postID, userID)
	if err != nil {
		return err
	}	
	if !postedByUser {
		return customErrors.ErrPostNotOwnedByUser
	}
	// call backend to delete the post, return if there is error
	imageUrl, err := sqlMethods.DeletePostFromSQL(postID)
	if err != nil {
		fmt.Printf("Failed to delete post from SQL %v\n", err)
		return err
	}
	err = deleteFileFromS3(imageUrl)
	if err != nil {
		return customErrors.ErrUnableToDeleteFromS3
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

func IncreaseViewByPostID(postID uuid.UUID) error {
	
	// call backedn
	err := sqlMethods.IncreaseViewByPostID(postID)
	if err != nil {
		fmt.Printf("Failed to search post from SQL, %v\n", err)
		return err
	}
	return err
}

func GetLikedPostsByUserID(userID int64, limit int, offset int) ([] model.Post, error) {
	// call backend to get the post information liked by the user and if there is error

	posts, err := sqlMethods.GetLikedPostsByUserID(userID, limit, offset)
	if err != nil {
		fmt.Printf("Failed to search likes by userID from SQL, %v\n", err)
		return []model.Post{}, err
	}
	return posts, err
}