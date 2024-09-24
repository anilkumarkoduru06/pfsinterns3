document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDetailsInput = document.getElementById('taskDetails');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const showAllBtn = document.getElementById('showAllBtn');
    const showCompletedBtn = document.getElementById('showCompletedBtn');
    const showPendingBtn = document.getElementById('showPendingBtn');
    let filter = 'all';

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks
            .filter(task => filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed))
            .forEach((task, index) => {
                addTaskToList(task, index);
            });
    };

    // Add task to list and localStorage
    const addTaskToList = (task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'list-group-item task-item';
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            ${task.details ? `<div class="task-details">${task.details}</div>` : ''}
            <div>
                <button class="btn btn-success btn-sm complete-btn" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    };

    // Handle Add Task button click
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDetails = taskDetailsInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: taskText, details: taskDetails, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            addTaskToList({ text: taskText, details: taskDetails, completed: false }, tasks.length - 1);
            taskInput.value = '';
            taskDetailsInput.value = '';
        }
    });

    // Handle task actions
    taskList.addEventListener('click', (e) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = e.target.dataset.index;
        if (e.target.classList.contains('complete-btn')) {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const newText = prompt('Edit task:', tasks[index].text);
            const newDetails = prompt('Edit details:', tasks[index].details);
            if (newText !== null) {
                tasks[index].text = newText;
            }
            if (newDetails !== null) {
                tasks[index].details = newDetails;
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        } else if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    });

    // Handle filter buttons
    showAllBtn.addEventListener('click', () => {
        filter = 'all';
        loadTasks();
    });

    showCompletedBtn.addEventListener('click', () => {
        filter = 'completed';
        loadTasks();
    });

    showPendingBtn.addEventListener('click', () => {
        filter = 'pending';
        loadTasks();
    });

    // Initial load
    loadTasks();
});
