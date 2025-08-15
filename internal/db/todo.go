package db

import (
	"database/sql"
	"time"

	"github.com/leroyshirto/ai-playground/internal/models"
	_ "github.com/mattn/go-sqlite3"
)

type TodoDB struct {
	db *sql.DB
}

// NewTodoDB creates a new TodoDB instance
func NewTodoDB(dbPath string) (*TodoDB, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	todoDb := &TodoDB{db: db}
	if err := todoDb.createTables(); err != nil {
		return nil, err
	}

	return todoDb, nil
}

// createTables creates the necessary database tables
func (tdb *TodoDB) createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		completed BOOLEAN DEFAULT FALSE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`

	_, err := tdb.db.Exec(query)
	return err
}

// GetAllTodos retrieves all todos from the database
func (tdb *TodoDB) GetAllTodos() ([]models.Todo, error) {
	query := `
	SELECT id, title, description, completed, created_at, updated_at
	FROM todos
	ORDER BY created_at DESC`

	rows, err := tdb.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		err := rows.Scan(
			&todo.ID,
			&todo.Title,
			&todo.Description,
			&todo.Completed,
			&todo.CreatedAt,
			&todo.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}

	return todos, nil
}

// GetTodoByID retrieves a todo by its ID
func (tdb *TodoDB) GetTodoByID(id int) (*models.Todo, error) {
	query := `
	SELECT id, title, description, completed, created_at, updated_at
	FROM todos
	WHERE id = ?`

	var todo models.Todo
	err := tdb.db.QueryRow(query, id).Scan(
		&todo.ID,
		&todo.Title,
		&todo.Description,
		&todo.Completed,
		&todo.CreatedAt,
		&todo.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &todo, nil
}

// CreateTodo creates a new todo in the database
func (tdb *TodoDB) CreateTodo(req models.CreateTodoRequest) (*models.Todo, error) {
	query := `
	INSERT INTO todos (title, description, created_at, updated_at)
	VALUES (?, ?, ?, ?)`

	now := time.Now()
	result, err := tdb.db.Exec(query, req.Title, req.Description, now, now)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return tdb.GetTodoByID(int(id))
}

// UpdateTodo updates an existing todo in the database
func (tdb *TodoDB) UpdateTodo(id int, req models.UpdateTodoRequest) (*models.Todo, error) {
	// First get the existing todo
	existingTodo, err := tdb.GetTodoByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.Title != nil {
		existingTodo.Title = *req.Title
	}
	if req.Description != nil {
		existingTodo.Description = *req.Description
	}
	if req.Completed != nil {
		existingTodo.Completed = *req.Completed
	}
	existingTodo.UpdatedAt = time.Now()

	query := `
	UPDATE todos
	SET title = ?, description = ?, completed = ?, updated_at = ?
	WHERE id = ?`

	_, err = tdb.db.Exec(query,
		existingTodo.Title,
		existingTodo.Description,
		existingTodo.Completed,
		existingTodo.UpdatedAt,
		id,
	)

	if err != nil {
		return nil, err
	}

	return existingTodo, nil
}

// DeleteTodo deletes a todo from the database
func (tdb *TodoDB) DeleteTodo(id int) error {
	query := `DELETE FROM todos WHERE id = ?`
	_, err := tdb.db.Exec(query, id)
	return err
}

// Close closes the database connection
func (tdb *TodoDB) Close() error {
	return tdb.db.Close()
}