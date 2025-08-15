import React from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className="todo-item" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '8px',
      backgroundColor: todo.completed ? '#f8f9fa' : '#ffffff'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '12px' }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{
          margin: '0 0 4px 0',
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#6c757d' : '#212529'
        }}>
          {todo.title}
        </h4>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#6c757d',
          textDecoration: todo.completed ? 'line-through' : 'none'
        }}>
          {todo.description}
        </p>
        <small style={{ color: '#6c757d', fontSize: '12px' }}>
          Created: {new Date(todo.created_at).toLocaleDateString()}
        </small>
      </div>
      <div>
        <button
          onClick={() => onEdit(todo)}
          style={{
            marginRight: '8px',
            padding: '6px 12px',
            border: '1px solid #007bff',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          style={{
            padding: '6px 12px',
            border: '1px solid #dc3545',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;