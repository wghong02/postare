package sqlMethods

import (
	"appBE/model"
	"context"
	"fmt"

	"github.com/google/uuid"
)

func SavePostToSQL(post *model.Post) error {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// save post
	query := `INSERT INTO Posts (PostID, Title, 
        Description, Likes, CategoryID, PostOwnerID, PutOutTime, PostDetails, 
        IsAvailable, ImageUrl, Views) VALUES ($1, 
        $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11)`

	_, err := conn.Exec(context.Background(),
		query, post.PostID, post.Title, post.Description,
		post.Likes, post.CategoryID, post.PostOwnerID, post.PutOutTime,
		post.PostDetails, post.IsAvailable, post.ImageUrl, post.Views)

	return err
}

func SearchPostsByDescription(keyword string, limit int, offset int) ([]model.Post, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	// vague search so any description or title contains count
	if keyword == "" {
		query = `SELECT * FROM Posts LIMIT $1 OFFSET $2`
		args = append(args, limit, offset)
	} else {
		query = `SELECT * FROM Posts WHERE title ILIKE $1 OR description ILIKE $1 OR PostDetails ILIKE $1 LIMIT $2 OFFSET $3`
		args = append(args, "%"+keyword+"%", limit, offset)
	}

	// search with sql statement
	rows, err := conn.Query(context.Background(), query, args...)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.Title,
			&post.Description, &post.Likes, &post.CategoryID,
			&post.PostOwnerID, &post.PutOutTime, &post.PostDetails,
			&post.IsAvailable, &post.ImageUrl, &post.Views,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func CheckIfPostExistByID(postID uuid.UUID) (bool, error) {
	conn := connectDB()
	defer conn.Close(context.Background())

	// check if user exists
	var exists bool
	err := conn.QueryRow(context.Background(),
		"SELECT EXISTS(SELECT 1 FROM Posts WHERE postID = $1)",
		postID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func GetPostByID(postID uuid.UUID) (model.Post, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if post id exists
	var post model.Post
	err := conn.QueryRow(context.Background(),
		`SELECT PostID, Title, Description, Likes, CategoryID, PostOwnerID, 
        PutOutTime, PostDetails, IsAvailable, ImageUrl, Views 
        FROM Posts WHERE PostID=$1`, postID).Scan(
		&post.PostID, &post.Title, &post.Description,
		&post.Likes, &post.CategoryID, &post.PostOwnerID,
		&post.PutOutTime, &post.PostDetails, &post.IsAvailable,
		&post.ImageUrl, &post.Views,
	)

	// Check if the query returned an error
	if err != nil {
		return model.Post{}, err
	}

	return post, nil
}

func DeletePostFromSQL(postID uuid.UUID, userID int64) error {
	conn := connectDB()
	defer conn.Close(context.Background())

	// delete from db
	_, err := conn.Exec(context.Background(), "DELETE FROM Posts WHERE PostID=$1", postID)
	if err != nil {
		return err
	}
	return nil
}

func GetMostViewedPosts(limit int, offset int) ([]model.Post, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Posts ORDER BY views DESC, putouttime DESC LIMIT $1 OFFSET $2`
	args = append(args, limit, offset)

	// search top results with sql statement
	rows, err := conn.Query(context.Background(), query, args...)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.Title, &post.Description,
			&post.Likes, &post.CategoryID, &post.PostOwnerID,
			&post.PutOutTime, &post.PostDetails, &post.IsAvailable,
			&post.ImageUrl, &post.Views,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func SearchPostsByUserID(userID int64, limit int, offset int) ([]model.Post, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if post id exists
	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Posts WHERE PostOwnerID = $1 ORDER BY putouttime DESC LIMIT $2 OFFSET $3`
	args = append(args, userID, limit, offset)

	// search with sql statement
	rows, err := conn.Query(context.Background(), query, args...)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.PostID, &post.Title, &post.Description,
			&post.Likes, &post.CategoryID, &post.PostOwnerID,
			&post.PutOutTime, &post.PostDetails, &post.IsAvailable,
			&post.ImageUrl, &post.Views,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
