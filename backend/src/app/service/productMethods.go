package service

import (
	sqlMethods "appBE/database"
	"appBE/model"
	"fmt"
)

func UploadProduct(product *model.Product) error {
	// call backend to save the product, return if there is error
	if err := sqlMethods.SaveProductToSQL(product); err != nil {
		fmt.Printf("Failed to save product to SQL %v\n", err)
		return err
	}
	return nil
}

func DeleteProduct(productID int64, userID int64) error {
	// first verify that the product is owned by the user
	product, err := sqlMethods.SearchProductByID(productID)
	if err != nil {
		return err
	}
	sellerID := product.SellerID
	if sellerID != userID {
		return fmt.Errorf("product not owned by user")
	}
	// call backend to delete the product, return if there is error
	if err = sqlMethods.DeleteProductFromSQL(productID, userID); err != nil {
		fmt.Printf("Failed to delete product from SQL %v\n", err)
		return err
	}
	return nil
}

func SearchProductByID(productID int64) (model.Product, error) {
	
	// call backend to get the product information, return the product info and if there is error
	product, err := sqlMethods.SearchProductByID(productID)
	if  err != nil {
		fmt.Printf("Failed to search product from SQL, %v\n", err)
		return model.Product{}, err
	}
	return product, err
}

// func SearchProductsByTitle(keyword string) ([]model.Product, error) {
// 	// call backend to search the product if its title contains the keyword, return if there is error
// 	// if no keywords given, return all products
// 	if(keyword=="") {
// 		// query := `SELECT * FROM Products`
// 		return sqlMethods.SearchProductsByDescription(keyword, 0, 0)
// 	}else{
// 		// query := `SELECT * FROM Products WHERE title LIKE $1`
// 		return sqlMethods.SearchProductsByDescription(keyword, 0 ,0)
// 	}
// }

func SearchProductsByDescription(keyword string, batch int, totalSize int) ([]model.Product, error) {	
	// call backend to search the product if its title contains the keyword, return if there is error
	// totalSize is the total number of products to load from the server
	// batch k determines the kth number of batch to load in to the client
	// if no keywords given, return the first totalSize products
    offset := (batch - 1) * totalSize

	// use OFFSET to achieve the kth batch
	// fmt.Println("The input query is", query)
    
	return sqlMethods.SearchProductsByDescription(keyword, totalSize, offset)
}