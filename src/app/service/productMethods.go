package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"fmt"
)

func UploadProduct(product *model.Product) error {

	if err := sqlMethods.SaveProductToSQL(product); err != nil {
		fmt.Printf("Failed to save app to SQL %v\n", err)
		return err
	}
	return nil
}

func DeleteProduct(productID int64, userID int64) error {
	if err := sqlMethods.DeleteProductFromSQL(productID, userID); err != nil {
		fmt.Printf("Failed to delete app from SQL %v\n", err)
		return err
	}
	return nil
}

func GetProduct(productID int64, userID int64) error {
	if err := sqlMethods.DeleteProductFromSQL(productID, userID); err != nil {
		fmt.Printf("Failed to delete app from SQL %v\n", err)
		return err
	}
	return nil
}

func SearchProductsByTitle(keyword string) ([]model.Product, error) {
	if(keyword=="") {
		query := `SELECT * FROM Products`
		return sqlMethods.SearchProducts(keyword, query)
	}else{
		query := `SELECT * FROM Products WHERE title LIKE $1`
		return sqlMethods.SearchProducts(keyword, query)
	}
}

func SearchProductsByDescription(keyword string, batch int, totalSize int) ([]model.Product, error) {	

    offset := (batch - 1) * totalSize

	var query string
	if keyword == "" {
        query = fmt.Sprintf(`SELECT * FROM Products LIMIT %d OFFSET %d`, totalSize, offset)
    } else {
        query = fmt.Sprintf(`SELECT * FROM Products WHERE description LIKE $1 LIMIT %d OFFSET %d`, totalSize, offset)
    }
	// fmt.Println("The input query is", query)
    
	return sqlMethods.SearchProducts(keyword, query)
}