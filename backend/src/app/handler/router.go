package handler

import (
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func InitRouter() http.Handler {
	// use jwt middleware for token auth
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(mySigningKey), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	// user related activities (upload product, delete product, etc.) requires to verify auth
	// other activities do not
	router := mux.NewRouter()
	router.Handle("/user/products/upload",
		jwtMiddleware.Handler(http.HandlerFunc(uploadProductHandler))).Methods("POST")
	router.Handle("/user/products/delete/{productID}",
		jwtMiddleware.Handler(http.HandlerFunc(deleteProductHandler))).Methods("Delete")
	router.Handle("/products/{productID}",
		http.HandlerFunc(getProductByIDHandler)).Methods("GET")
	router.Handle("/products/get/mostViewed",
		http.HandlerFunc(getMostViewedProductsHandler)).Methods("GET")
	router.Handle("/users/{userID}",
		http.HandlerFunc(getUserInfoHandler)).Methods("GET")
	router.Handle("/search",
		http.HandlerFunc(searchProductsHandler)).Methods("GET")
	router.Handle("/productHistory/{userID}",
		http.HandlerFunc(getUserProductsHandler)).Methods("GET")
	router.Handle("/auth/register",
		http.HandlerFunc(registerHandler)).Methods("POST")
	router.Handle("/auth/login",
		http.HandlerFunc(logInHandler)).Methods("POST")

	// default for middleware setup
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
	)

	return corsMiddleware(router)
}
