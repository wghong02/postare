package sqlMethods

import (
	customErrors "appBE/errors"
	"appBE/model"
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

func SavePostToSQL(post *model.Post) error {

	// save post
	query := `INSERT INTO Posts (PostID, Title, 
        Description, Likes, CategoryID, PostOwnerID, PutOutTime, PostDetails, 
        IsAvailable, ImageUrl, Views) VALUES ($1, 
        $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11)`

	_, err := dbPool.Exec(context.Background(),
		query, post.PostID, post.Title, post.Description,
		post.Likes, post.CategoryID, post.PostOwnerID, post.PutOutTime,
		post.PostDetails, post.IsAvailable, post.ImageUrl, post.Views)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23503 is the foreign key violation error code in PostgreSQL
		return customErrors.ErrUserNotFound
	}

	return err
}

func CheckIfPostOwnedByUser(postID uuid.UUID, userID int64) (bool, error) {
	// check if the post given its id is owned by the given user

	var postOwnerID int64
    err := dbPool.QueryRow(context.Background(), "SELECT PostOwnerID FROM Posts WHERE PostID=$1", postID).Scan(&postOwnerID)
    if err != nil {
        if errors.Is (err, pgx.ErrNoRows) {
            return false, customErrors.ErrPostNotFound
        }
        return false, err
    }
    if postOwnerID != userID {
        return false, customErrors.ErrPostNotOwnedByUser
    }
    return true, nil
}

func DeletePostFromSQL(postID uuid.UUID) (string, error) {

	// copy image url
	var imageUrl string
	err := dbPool.QueryRow(context.Background(), "SELECT ImageURL FROM Posts WHERE PostID=$1", postID).Scan(&imageUrl)
	if err != nil {
		return "", err
	}

	// delete from db
	result, err := dbPool.Exec(context.Background(), "DELETE FROM Posts WHERE PostID=$1", postID)
	if err != nil {
		return "", err
	}
	// if post does not exist, the 0 row is affected
	if result.RowsAffected() == 0 {
        return "", customErrors.ErrPostNotFound
    }

	return imageUrl, nil
}

func SearchPostsByDescription(keyword string, limit int, offset int) ([]model.Post, error) {

	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	// vague search so any description or title contains count
	if keyword == "" {
		query = `SELECT * FROM Posts ORDER BY likes DESC, views DESC, putouttime DESC LIMIT $1 OFFSET $2`
		args = append(args, limit, offset)
	} else {
		query = `SELECT * FROM Posts WHERE title ILIKE $1 OR description ILIKE $1 OR PostDetails ILIKE $1 
				ORDER BY likes DESC, views DESC, putouttime DESC LIMIT $2 OFFSET $3`
		args = append(args, "%"+keyword+"%", limit, offset)
	}

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
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

func GetPostByID(postID uuid.UUID) (model.Post, error) {

	// search if post id exists
	var post model.Post
	err := dbPool.QueryRow(context.Background(),
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
		if errors.Is (err, pgx.ErrNoRows) {
            return model.Post{}, customErrors.ErrPostNotFound
        }
		return model.Post{}, err
	}

	return post, nil
}


func GetMostInOneAttributePosts(limit int, offset int, attribute string) ([]model.Post, error) {

	// get the post ranked by one column (attribute)
	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	if attribute == "liked" {
		query = `SELECT * FROM Posts ORDER BY likes DESC, views DESC, putouttime DESC LIMIT $1 OFFSET $2`
	} else if attribute == "viewed" {
		query = `SELECT * FROM Posts ORDER BY views DESC, likes DESC, putouttime DESC LIMIT $1 OFFSET $2`
	} else if attribute == "recent" {
		query = `SELECT * FROM Posts ORDER BY putouttime DESC, likes DESC, views DESC LIMIT $1 OFFSET $2`
	}
	
	args = append(args, limit, offset)

	// search top results with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
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

	// Check if user exists
    exists, err := checkIfUserExistsByID(userID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrUserNotFound
    }

	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Posts WHERE PostOwnerID = $1 ORDER BY putouttime DESC LIMIT $2 OFFSET $3`
	args = append(args, userID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
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

func checkIfPostExistsByID(postID uuid.UUID) (bool, error) {
	// check if a post exists by its id
    var exists bool
    err := dbPool.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Posts WHERE PostID=$1)", postID).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}

func IncreaseViewByPostID(postID uuid.UUID) error {
	// increase given post's view by 1, should be changed when scaling to avoid bottleneck

	query := `
		UPDATE Posts
		SET Views = Views + 1
		WHERE PostID = $1
	`

	_, err := dbPool.Exec(context.Background(), query, postID)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// This condition should generally not occur with UPDATE, but for safety
			return customErrors.ErrPostNotFound
		}
		return err
	}

	return nil
}

func GetLikedPostsByUserID(userID int64, limit int, offset int) ([]model.Post, error) {

	// Check if user exists
    exists, err := checkIfUserExistsByID(userID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrUserNotFound
    }

	var posts []model.Post
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT p.*
			FROM Posts p
			JOIN Likes l ON p.postID = l.postID
			WHERE l.Liker = $1
			ORDER BY l.DateTime DESC
			LIMIT $2 OFFSET $3;`
	args = append(args, userID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
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