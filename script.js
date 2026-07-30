document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const prioritySelect = document.getElementById('prioritySelect');
  const dateInput = document.getElementById('dateInput');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const taskCount = document.getElementById('taskCount');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const actionsSection = document.getElementById('actionsSection');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';
  let editingTaskId = null;

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

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

  function getFilteredTasks() {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  function renderTasks() {
    const filtered = getFilteredTasks();

    if (tasks.length === 0) {
      taskList.innerHTML = '';
      emptyState.style.display = 'block';
      actionsSection.style.display = 'none';
      taskCount.textContent = '0';
      return;
    }

    emptyState.style.display = 'none';

    if (filtered.length === 0) {
      taskList.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.querySelector('p').textContent =
        currentFilter === 'active' ? 'No active tasks. Nice!' :
        currentFilter === 'completed' ? 'No completed tasks yet.' :
        'No tasks yet. Add one above!';
      actionsSection.style.display = 'none';
      taskCount.textContent = '0';
      return;
    }

    emptyState.style.display = 'none';
    taskList.innerHTML = '';

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
      checkbox.addEventListener('click', () => toggleTask(task.id));

      const content = document.createElement('div');
      content.className = 'task-content';

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text' + (task.completed ? ' completed' : '');
      textSpan.textContent = task.text;
      textSpan.addEventListener('dblclick', () => startEdit(task.id));

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      const priorityBadge = document.createElement('span');
      priorityBadge.className = 'task-priority priority-' + task.priority;
      priorityBadge.textContent = task.priority;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'task-date';
      if (task.dueDate) {
        dateSpan.textContent = formatDate(task.dueDate);
        if (isOverdue(task.dueDate) && !task.completed) {
          dateSpan.classList.add('overdue');
        } else if (task.completed) {
          dateSpan.textContent += ' (done)';
        }
      }

      meta.appendChild(priorityBadge);
      if (task.dueDate) meta.appendChild(dateSpan);

      content.appendChild(textSpan);
      content.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'task-action-btn edit-btn';
      editBtn.innerHTML = '<i class="fas fa-pen"></i>';
      editBtn.title = 'Edit';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startEdit(task.id);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-action-btn delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.title = 'Delete';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(content);
      li.appendChild(actions);

      taskList.appendChild(li);
    });

    const activeCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = activeCount;

    actionsSection.style.display = 'flex';
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.style.animation = 'shake 0.4s ease';
      taskInput.focus();
      setTimeout(() => { taskInput.style.animation = ''; }, 400);
      return;
    }

    const newTask = {
      id: generateId(),
      text: text,
      priority: prioritySelect.value,
      dueDate: dateInput.value || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = '';
    dateInput.value = '';
    prioritySelect.value = 'medium';
    taskInput.focus();
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add('removing');
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
      }, 300);
    } else {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }
  }

  function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    editInput.value = task.text;
    editModal.style.display = 'flex';
    editInput.focus();
  }

  function saveEdit() {
    const text = editInput.value.trim();
    if (!text || !editingTaskId) {
      editInput.style.animation = 'shake 0.4s ease';
      setTimeout(() => { editInput.style.animation = ''; }, 400);
      return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.text = text;
      saveTasks();
      renderTasks();
    }

    closeEditModal();
  }

  function closeEditModal() {
    editModal.style.display = 'none';
    editingTaskId = null;
    editInput.value = '';
  }

  function clearCompleted() {
    const completed = tasks.filter(t => t.completed);
    if (completed.length === 0) return;

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showToast('Completed tasks cleared');
  }

  function clearAll() {
    if (tasks.length === 0) return;
    if (!confirm('Are you sure you want to delete ALL tasks?')) return;

    tasks = [];
    saveTasks();
    renderTasks();
    showToast('All tasks cleared');
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  addBtn.addEventListener('click', addTask);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);
  clearAllBtn.addEventListener('click', clearAll);

  saveEditBtn.addEventListener('click', saveEdit);
  cancelEditBtn.addEventListener('click', closeEditModal);

  editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEdit();
  });

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal.style.display === 'flex') {
      closeEditModal();
    }
  });

  renderTasks();
});