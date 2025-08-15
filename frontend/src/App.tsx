import React, { useState, useEffect } from 'react';
import './App.css';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types/todo';
import { todoService } from './services/todoService';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await todoService.getAllTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Make sure the API server is running.');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos([newTodo, ...todos]);
      setError(null);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (todoData: CreateTodoRequest) => {
    if (!editingTodo) return;
    
    try {
      const updateData: UpdateTodoRequest = {
        title: todoData.title,
        description: todoData.description,
      };
      const updatedTodo = await todoService.updateTodo(editingTodo.id, updateData);
      setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await todoService.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#343a40', marginBottom: '8px' }}>Todo App</h1>
        <p style={{ color: '#6c757d', margin: '0' }}>
          Manage your tasks with this simple todo application
        </p>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          {error}
        </div>
      )}

      <TodoForm
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        onCancel={editingTodo ? handleCancelEdit : undefined}
        initialTodo={editingTodo || undefined}
        isEditing={!!editingTodo}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading todos...</p>
        </div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
        />
      )}
    </div>
  );
}

export default App;
