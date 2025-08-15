import React, { useState } from 'react';
import { CreateTodoRequest, Todo } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => void;
  onCancel?: () => void;
  initialTodo?: Todo;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, initialTodo, isEditing = false }) => {
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    if (!isEditing) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>
        {isEditing ? 'Edit Todo' : 'Add New Todo'}
      </h3>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <textarea
          placeholder="Todo description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
      </div>
      <div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          {isEditing ? 'Update Todo' : 'Add Todo'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;