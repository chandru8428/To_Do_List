import TodoItem from './TodoItem';

function TodoList({ tasks, theme, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) return null;

  return (
    <section className="tasks-section">
      <ul className="task-list">
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            theme={theme}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </section>
  );
}

export default TodoList;