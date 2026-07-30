import { useState, useRef } from 'react';

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <section className="input-section">
      <form onSubmit={handleSubmit} className="input-row">
        <input
          ref={inputRef}
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="add-btn" title="Add Task">
          <i className="fas fa-plus"></i>
        </button>
      </form>
      <div className="options-row">
        <div className="priority-row">
          <label className="priority-label">Priority:</label>
<select id="priority-select" className="priority-select" defaultValue="medium">
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</select>
        </div>
        <div className="date-row">
          <label className="date-label">Due Date:</label>
          <input type="date" id="date-input" className="date-input" />
        </div>
      </div>
    </section>
  );
}

export default TodoForm;