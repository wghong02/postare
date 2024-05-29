package handler

import (
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func InitRouter() http.Handler {
    jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
        ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
            return []byte(mySigningKey), nil
        },
        SigningMethod: jwt.SigningMethodHS256,
    })

    router := mux.NewRouter()
    router.Handle("/user/products/upload", jwtMiddleware.Handler(http.HandlerFunc(uploadProductHandler))).Methods("POST")
    router.Handle("/user/products/delete/{productID}", jwtMiddleware.Handler(http.HandlerFunc(deleteProductHandler))).Methods("Delete")
    router.Handle("/products/{productID}", http.HandlerFunc(getProductHandler)).Methods("GET")
    router.Handle("/search", http.HandlerFunc(searchProductHandler)).Methods("GET")
    router.Handle("/auth/register", http.HandlerFunc(registerHandler)).Methods("POST")
    router.Handle("/auth/login", http.HandlerFunc(logInHandler)).Methods("POST")

    corsMiddleware := handlers.CORS(
        handlers.AllowedOrigins([]string{"*"}), 
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), 
        handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
    )

    return corsMiddleware(router)
}
