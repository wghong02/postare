package sqlMethods

import (
	"appBE/model"
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/jackc/pgx/v4"
)

func SaveProductToSQL(product *model.Product) error {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// check if user exists
	var exists bool
	err := conn.QueryRow(context.Background(),
		"SELECT EXISTS(SELECT 1 FROM Users WHERE UserID = $1)",
		product.SellerID).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("seller with ID %d does not exist", product.SellerID)
	}

	// save product
	query := `INSERT INTO Products (ProductID, Title, 
        Description, Price, CategoryID, SellerID, 
        Condition, PutOutTime, ProductLocation, ProductDetails, 
        Status, ImageUrl, Views) VALUES ($1, 
        $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11, $12, $13)`

	_, err = conn.Exec(context.Background(),
		query, product.ProductID, product.Title, product.Description,
		product.Price, product.CategoryID, product.SellerID, product.Condition,
		product.PutOutTime, product.ProductLocation, product.ProductDetails,
		product.Status, product.ImageUrl, product.Views)

	return err
}

func SearchProductsByDescription(keyword string, limit int, offset int) ([]model.Product, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	var products []model.Product
	var query string
	var args []interface{}

	// use args to avoid sql injection
	if keyword == "" {
		query = `SELECT * FROM Products LIMIT $1 OFFSET $2`
		args = append(args, limit, offset)
	} else {
		query = `SELECT * FROM Products WHERE title LIKE $1 OR description LIKE $1 LIMIT $2 OFFSET $3`
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
		var product model.Product
		err := rows.Scan(&product.ProductID, &product.Title,
			&product.Description, &product.Price, &product.CategoryID,
			&product.SellerID, &product.Condition, &product.PutOutTime,
			&product.ProductLocation, &product.ProductDetails, &product.Status,
			&product.ImageUrl, &product.Views,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}

func SearchProductByID(productID uuid.UUID) (model.Product, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if product id exists
	var product model.Product
	err := conn.QueryRow(context.Background(),
		`SELECT ProductID, Title, Description, Price, CategoryID, SellerID, 
        Condition, PutOutTime, ProductLocation, ProductDetails, Status, 
        ImageUrl, Views FROM Products WHERE ProductID=$1`, productID).Scan(
		&product.ProductID, &product.Title, &product.Description,
		&product.Price, &product.CategoryID, &product.SellerID,
		&product.Condition, &product.PutOutTime, &product.ProductLocation,
		&product.ProductDetails, &product.Status, &product.ImageUrl,
		&product.Views,
	)

	// Check if the query returned an error
	if err != nil {
		if err == pgx.ErrNoRows {
			return model.Product{}, fmt.Errorf("no product found with ID %d", productID)
		}
		return model.Product{}, err // Return other errors that might have occurred
	}

	return product, nil
}

func DeleteProductFromSQL(productID uuid.UUID, userID int64) error {
	conn := connectDB()
	defer conn.Close(context.Background())

	// delete from db
	_, err := conn.Exec(context.Background(), "DELETE FROM Products WHERE ProductID=$1", productID)
	if err != nil {
		return err
	}
	return nil
}

func GetMostViewedProducts(limit int, offset int) ([]model.Product, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	var products []model.Product
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM products ORDER BY views DESC, putouttime DESC  LIMIT $1 OFFSET $2`
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
		var product model.Product
		err := rows.Scan(&product.ProductID, &product.Title, &product.Description,
			&product.Price, &product.CategoryID, &product.SellerID,
			&product.Condition, &product.PutOutTime, &product.ProductLocation,
			&product.ProductDetails, &product.Status, &product.ImageUrl,
			&product.Views,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}

func SearchProductsByUserID(userID int64, limit int, offset int) ([]model.Product, error) {
	// connect to db
	conn := connectDB()
	defer conn.Close(context.Background())

	// search if product id exists
	var products []model.Product
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Products WHERE SellerID = $1 ORDER BY putouttime DESC LIMIT $2 OFFSET $3`
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
		var product model.Product
		err := rows.Scan(&product.ProductID, &product.Title, &product.Description,
			&product.Price, &product.CategoryID, &product.SellerID,
			&product.Condition, &product.PutOutTime, &product.ProductLocation,
			&product.ProductDetails, &product.Status, &product.ImageUrl,
			&product.Views,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}
