package sqlMethods

import (
	customErrors "appBE/errors"
	"appBE/model"
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgconn"
)

func SaveLikeToSQL(like *model.Like) error {

	// save comment
	query := `INSERT INTO Likes (PostID, 
        Liker, DateTime) VALUES ($1, $2, $3)`

	_, err := dbPool.Exec(context.Background(),
		query, like.PostID, like.Liker,
		like.DateTime)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23503 means not found
		return customErrors.ErrUserOrPostNotFound
	}

	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
		// means already has the like, so its ok
		return nil
	}

	return err
}

func DeleteLikeFromSQL(userID int64, postID uuid.UUID)  error {

	// delete from db
	_, err := dbPool.Exec(context.Background(), "DELETE FROM Likes WHERE liker=$1 AND postID=$2", userID, postID)
	if err != nil {
		return err
	}

	return nil
}

func CheckIfLikeExistsBy(userID int64, postID uuid.UUID) (bool, error) {
    var exists bool
    err := dbPool.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Likes WHERE Liker=$1 AND PostID=$2)", userID, postID).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}

func GetLikesByPostID(postID uuid.UUID, limit int, offset int) ([]model.Like, error) {

	// Check if user exists
    exists, err := checkIfPostExistsByID(postID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrPostNotFound
    }

	var likes []model.Like
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Likes WHERE PostID = $1 ORDER BY DateTime DESC LIMIT $2 OFFSET $3`
	args = append(args, postID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var like model.Like
		err := rows.Scan(&like.PostID, &like.Liker,
			&like.DateTime,
		)
		if err != nil {
			return nil, err
		}
		likes = append(likes, like)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return likes, nil
}

func GetLikesByUserID(userID int64, limit int, offset int) ([]model.Like, error) {

	// Check if user exists
    exists, err := checkIfUserExistsByID(userID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrUserNotFound
    }

	var likes []model.Like
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Likes WHERE Liker = $1 ORDER BY DateTime DESC LIMIT $2 OFFSET $3`
	args = append(args, userID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var like model.Like
		err := rows.Scan(&like.PostID, &like.Liker,
			&like.DateTime,
		)
		if err != nil {
			return nil, err
		}
		likes = append(likes, like)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return likes, nil
}

func GetTotalLikeCountByPostID(postID uuid.UUID) (int64, error) { // this includes comments and subComments
	exists, err := checkIfPostExistsByID(postID)
    if err != nil {
        return 0, err
    }
    if !exists {
        return 0, customErrors.ErrPostNotFound
    }

    query := `
        SELECT COUNT(*) FROM Likes WHERE postID = $1 ;
    `
    var totalCount int64
    err = dbPool.QueryRow(context.Background(), query, postID).Scan(&totalCount)
    if err != nil {
        return 0, err
    }

    return totalCount, nil
}