# Ex03 To-Do List using JavaScript
## Date:05.08.2026

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

## PROGRAM
main.jsx
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
app.jsx
```
import { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ThemeSwitcher from './components/ThemeSwitcher';
import './App.css';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dateStr);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < today;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState(() => localStorage.getItem('todo-theme') || 'white');
  const [editingTask, setEditingTask] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('todo-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (editingTask !== null) {
      const input = document.getElementById('edit-input');
      if (input) input.focus();
    }
  }, [editingTask]);

  const showToastMessage = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  const addTask = useCallback((text) => {
    if (!text.trim()) return;
    const priority = document.getElementById('priority-select')?.value || 'medium';
    const dueDate = document.getElementById('date-input')?.value || null;

    const newTask = {
      id: generateId(),
      text: text.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    showToastMessage('Task added!');
  }, [showToastMessage]);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToastMessage('Task deleted');
  }, [showToastMessage]);

  const editTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditingTask(task);
  }, [tasks]);

  const saveEdit = useCallback(() => {
    const input = document.getElementById('edit-input');
    const text = input?.value.trim();
    if (!text || editingTask === null) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? { ...t, text } : t))
    );
    setEditingTask(null);
    showToastMessage('Task updated');
  }, [editingTask, showToastMessage]);

  const cancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const clearCompleted = useCallback(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToastMessage(`Cleared ${completedCount} completed task(s)`);
  }, [tasks, showToastMessage]);

  const clearAll = useCallback(() => {
    if (tasks.length === 0) return;
    if (!window.confirm('Are you sure you want to delete ALL tasks?')) return;
    setTasks([]);
    showToastMessage('All tasks cleared');
  }, [tasks, showToastMessage]);

  const filteredTasks = (() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  })();

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className={`app-container theme-${theme}`}>
      <header className="app-header">
        <h1><i className="fas fa-check-circle"></i> To-Do App</h1>
        <p className="subtitle">Stay organized. Get things done.</p>
      </header>

      <main className="main-content">
        <TodoForm onAdd={addTask} />

        <section className="filter-section">
          <div className="filter-buttons">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-count">
            <span>{activeCount}</span> task{activeCount !== 1 ? 's' : ''} left
          </div>
        </section>

        <TodoList
          tasks={filteredTasks}
          theme={theme}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />

        {tasks.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <p>No tasks yet. Add one above!</p>
          </div>
        )}

        {tasks.length > 0 && (
          <section className="actions-section">
            <button className="action-btn clear-btn" onClick={clearCompleted}>
              <i className="fas fa-trash-alt"></i> Clear Completed
            </button>
            <button className="action-btn clear-all-btn" onClick={clearAll}>
              <i className="fas fa-broom"></i> Clear All
            </button>
          </section>
        )}
      </main>

      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <footer className="app-footer">
        <p>Double-click a task to edit. Click to toggle complete.</p>
      </footer>

      {editingTask && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) cancelEdit();
        }}>
          <div className="modal">
            <h2>Edit Task</h2>
            <input
              id="edit-input"
              type="text"
              className="task-input"
              placeholder="Update task..."
              defaultValue={editingTask.text}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
            <div className="modal-actions">
              <button className="add-btn" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast show">{toastMessage}</div>
      )}
    </div>
  );
}

export default TodoApp;
```

## OUTPUT
<img width="2559" height="1320" alt="image" src="https://github.com/user-attachments/assets/f04cc216-7157-4ed3-87d0-f178db21a318" />


## RESULT
The program for creating To-do list using JavaScript is executed successfully.
