// Array to store tasks, loaded from localStorage if available
const alertText = document.getElementById("alert-text");
const checkIcon = document.createElement("i");
checkIcon.className = "fa-solid fa-check-to-slot"; // Set icon class
checkIcon.style.marginRight = "8px"; // Add some spacing between icon and text
checkIcon.style.color = "orange"

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editTaskId = null; // Track task being edited

// Function to add a task or save an edited task
function addTask() {
    const taskName = document.getElementById('todo-name').value;
    const taskTime = document.getElementById('time').value;
    const taskDay = document.getElementById('day').value;
    let taskDate = '';

    if (taskDay === 'selected-day') {
        taskDate = document.getElementById('specific-date').value;
    }

    if (!taskName || !taskTime || !taskDay) {
        alertText.innerText = 'Please fill in all fields';
        alertText.style.display = "inline";
        setTimeout(() => {
            alertText.innerText = '';
            checkIcon.style.display = 'none'; // Hide icon when message disappears
        }, 3000);
        return;
    }

    if (editTaskId !== null) {
        // Edit existing task
        tasks = tasks.map(task => {
            if (task.id === editTaskId) {
                return {
                    ...task,
                    name: taskName,
                    time: taskTime,
                    day: taskDay,
                    date: taskDate
                };
            }
            return task;
        });
        alertText.innerText = 'Task edited successfully';
        showAlertIcon(); // Show the icon next to the message
        editTaskId = null; // Reset after editing
    } else {
        // Add new task
        const task = {
            id: Date.now(), // Unique task ID
            name: taskName,
            time: taskTime,
            day: taskDay,
            date: taskDate,
            completed: false
        };

        // Add the new task to the tasks array
        tasks.push(task);
        alertText.innerText = 'Task added successfully';
        showAlertIcon(); // Show the icon next to the message
    }

    // Save the tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Update the task list display
    displayTasks();

    // Clear input fields
    document.getElementById('todo-name').value = '';
    document.getElementById('time').value = '';
    document.getElementById('day').value = '';
    document.getElementById('specific-date').value = '';

    // Start checking for task alerts
    checkTasks();
}

// Function to show the icon next to the alert message
function showAlertIcon() {
    checkIcon.style.display = 'inline'; // Display the icon
    alertText.style.display = 'inline';
    alertText.prepend(checkIcon); // Place the icon before the text

    setTimeout(() => {
        alertText.innerText = '';
        checkIcon.style.display = 'none'; // Hide icon after message
    }, 3000);
}

// Function to display tasks in the task list
function displayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ''; // Clear previous content

    tasks.forEach(task => {
        const taskDayDisplay = task.day === 'selected-day' ? task.date : task.day;

        // Create a task container
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-item');
        taskContainer.setAttribute('data-id', task.id);

        // Checkbox for marking task as completed
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleCompleteTask(task.id));

        // Task name and time
        const taskContent = document.createElement('span');
        taskContent.innerHTML = `${task.name} | ${task.time} | ${taskDayDisplay}`;

        // Edit button
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => editTask(task.id));

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        // Apply button styles
        editButton.style.cssText = 'border: none; color: red; margin-right: 20px; border-radius: 5px;';
        deleteButton.style.cssText = 'border: none; color: red; margin-right: 20px; border-radius: 5px;';

        // Append elements to the task container
        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(taskContent);
        taskContainer.appendChild(editButton);
        taskContainer.appendChild(deleteButton);

        // Add the task container to the task list
        taskList.appendChild(taskContainer);
    });
}

// Function to toggle task completion
function toggleCompleteTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });

    // Save updated tasks to localStorage and refresh the list
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Function to edit a task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Populate form with task details for editing
        document.getElementById('todo-name').value = task.name;
        document.getElementById('time').value = task.time;
        document.getElementById('day').value = task.day;
        if (task.day === 'selected-day') {
            document.getElementById('specific-date').value = task.date;
        }

        // Set the task ID to be edited
        editTaskId = taskId;
    }
}

// Function to delete a task
function deleteTask(taskId) {
    // Remove the task from the tasks array
    tasks = tasks.filter(task => task.id !== taskId);

    // Save the updated tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Refresh the task list
    displayTasks();
}

// Function to check tasks and trigger alerts
function checkTasks() {
    setInterval(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const currentDay = now.getDay();
        const currentDate = now.toISOString().split('T')[0];

        tasks.forEach(task => {
            if (task.time === currentTime && !task.completed) {
                if (
                    (task.day === 'weekday' && currentDay >= 1 && currentDay <= 5) ||
                    (task.day === 'weekend' && (currentDay === 0 || currentDay === 6)) ||
                    (task.day === 'selected-day' && task.date === currentDate)
                ) {
                    // Request permission for notifications
                    if (Notification.permission !== "granted") {
                        Notification.requestPermission().then(permission => {
                            if (permission === "granted") {
                                showNotification(task.name);
                            }
                        });
                    } else {
                        showNotification(task.name);
                    }
                }
            }
        });
    }, 60000); // Check every minute
}

// Function to show notification
function showNotification(taskName) {
    const notification = new Notification("Task Reminder", {
        body: `It's time for your task: ${taskName}`,
        icon: './icon-img/notification.png', // Placeholder icon
        tag: "task-reminder",
        vibrate: [200, 100, 200]
    });

    // Play notification sound manually
    const audio = new Audio('./icon-img/notification.mp3');
    audio.play();

    // Automatically close the notification after 8 seconds
    setTimeout(() => {
        notification.close();
    }, 8000);
}

// Function to toggle specific date input visibility
function toggleDateInput() {
    const daySelect = document.getElementById('day');
    const specificDateContainer = document.getElementById('specific-date-container');
    
    if (daySelect.value === 'selected-day') {
        specificDateContainer.style.display = 'block';
    } else {
        specificDateContainer.style.display = 'none';
    }
}

// Add event listener to day select
document.getElementById('day').addEventListener('change', toggleDateInput);

// Load tasks and start checking for alerts on page load
document.addEventListener('DOMContentLoaded', (event) => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Start checking tasks when the page loads
    checkTasks();

    // Display tasks from localStorage on page load
    displayTasks();
});
