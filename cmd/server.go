package cmd

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/leroyshirto/ai-playground/internal/api"
	"github.com/leroyshirto/ai-playground/internal/db"
	"github.com/rs/cors"
	"github.com/spf13/cobra"
)

var (
	port   string
	dbPath string
)

// serverCmd represents the server command
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start the TODO REST API server",
	Long:  `Start the TODO REST API server with SQLite database backend.`,
	Run: func(cmd *cobra.Command, args []string) {
		startServer()
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)
	serverCmd.Flags().StringVarP(&port, "port", "p", "8080", "Port to run the server on")
	serverCmd.Flags().StringVarP(&dbPath, "database", "d", "todos.db", "Path to SQLite database file")
}

func startServer() {
	// Initialize database
	database, err := db.NewTodoDB(dbPath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	// Initialize handlers
	todoHandler := api.NewTodoHandler(database)

	// Setup router
	router := mux.NewRouter()
	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	// Todo routes
	apiRouter.HandleFunc("/todos", todoHandler.GetTodos).Methods("GET")
	apiRouter.HandleFunc("/todos", todoHandler.CreateTodo).Methods("POST")
	apiRouter.HandleFunc("/todos/{id}", todoHandler.GetTodo).Methods("GET")
	apiRouter.HandleFunc("/todos/{id}", todoHandler.UpdateTodo).Methods("PUT")
	apiRouter.HandleFunc("/todos/{id}", todoHandler.DeleteTodo).Methods("DELETE")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)

	fmt.Printf("TODO API server starting on port %s\n", port)
	fmt.Printf("Database: %s\n", dbPath)
	fmt.Printf("API endpoints available at: http://localhost:%s/api/v1/todos\n", port)

	log.Fatal(http.ListenAndServe(":"+port, handler))
}