import { useState } from 'react';

function TodoItem({ task, theme, onToggle, onDelete, onEdit }) {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const handleDblClick = () => {
    onEdit(task.id);
  };

  return (
    <li className={`task-item ${removing ? 'removing' : ''}`} data-id={task.id}>
      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        title={task.completed ? 'Mark as active' : 'Mark as complete'}
      />
      <div className="task-content">
        <span className={`task-text ${task.completed ? 'completed' : ''}`} onDoubleClick={handleDblClick}>
          {task.text}
        </span>
        <div className="task-meta">
          <span className={`task-priority priority-${task.priority}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`task-date ${!task.completed && isOverdue(task.dueDate) ? 'overdue' : ''}`}>
              {formatDate(task.dueDate)}
              {task.completed && ' (done)'}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button className="task-action-btn edit-btn" onClick={() => onEdit(task.id)} title="Edit">
          <i className="fas fa-pen"></i>
        </button>
        <button className="task-action-btn delete-btn" onClick={handleDelete} title="Delete">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </li>
  );
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

export default TodoItem;