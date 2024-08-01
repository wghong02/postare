package sqlMethods

import (
	customErrors "appBE/errors"
	"appBE/model"
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgconn"
)

func SaveLikeToSQL(like *model.Like) error {

	// save the like
	query := `INSERT INTO Likes (PostID, 
        Liker, DateTime) VALUES ($1, $2, $3)`

	_, err := dbPool.Exec(context.Background(),
		query, like.PostID, like.Liker,
		like.DateTime)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23503 foreign key volation, means not found
		return customErrors.ErrUserOrPostNotFound
	}

	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
		// 23505 duplicate key, means already has the like, so its ok
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
	// check if the like exist given the user and post ids
    var exists bool
    err := dbPool.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Likes WHERE Liker=$1 AND PostID=$2)", userID, postID).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}

// func GetTotalLikeCountByPostID(postID uuid.UUID) (int64, error) {
// 	// get the total number of likes associated with a post
// 	exists, err := checkIfPostExistsByID(postID)
//     if err != nil {
//         return 0, err
//     }
//     if !exists {
//         return 0, customErrors.ErrPostNotFound
//     }

//     query := `
//         SELECT COUNT(*) FROM Likes WHERE postID = $1 ;
//     `
//     var totalCount int64
//     err = dbPool.QueryRow(context.Background(), query, postID).Scan(&totalCount)
//     if err != nil {
//         return 0, err
//     }

//     return totalCount, nil
// }