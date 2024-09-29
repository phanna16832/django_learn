// Notify the user
function notify(taskName, dateValue, isUpdate = false, isDue = false) {
    console.log('Creating notification...');
    let title, body;
    
    if (isDue) {
        title = `Task Due: ${taskName}`;
        body = `This task is now due!`;
    } else {
        title = isUpdate ? `Task Updated: ${taskName}` : `New Task Added: ${taskName}`;
        body = `Due on: ${new Date(dateValue).toLocaleString()}`;
    }
    
    const notification = new Notification(title, {
        body: body,
        icon: './icon-img/notification.png', // Placeholder icon
        tag: isDue ? "due-task" : (isUpdate ? "update-task" : "new-task"),
        vibrate: [200, 100, 200]
    });

    // Play notification sound manually
    const audio = new Audio('./icon-img/notification.mp3');
    audio.play();

    // Automatically close the notification after 5 seconds
    setTimeout(() => {
        notification.close();
    }, 5000);
}

// Handle form submit and show notification
function handleFormSubmit() {
    console.log('Submit button clicked');
    const taskName = document.getElementById('task-name').value;
    const dateValue = document.getElementById('date').value;

    if (!taskName || !dateValue) {
        alert('Please fill in both task name and date.');
        return;
    }

    // Add task to the array
    tasks.push({ name: taskName, date: dateValue, notified: false });

    // Save tasks to local storage
    saveTasks();

    // Clear form fields
    document.getElementById('task-name').value = '';
    document.getElementById('date').value = '';

    // Hide the form
    toggleForm('todo-form');

    // Update the task list display
    displayTasks();

    if (Notification.permission === 'granted') {
        notify(taskName, dateValue);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((res) => {
            if (res === 'granted') {
                notify(taskName, dateValue);
            }
        });
    } else {
        console.log('Notifications not allowed');
    }
}

// Handle edit form submit
function handleEditSubmit() {
    const taskName = document.getElementById('edit-task-name').value;
    const dateValue = document.getElementById('edit-date').value;

    if (!taskName || !dateValue) {
        alert('Please fill in both task name and date.');
        return;
    }

    // Update the task in the array
    tasks[editingIndex] = { name: taskName, date: dateValue, notified: false };

    // Save tasks to local storage
    saveTasks();

    // Clear form fields and reset editingIndex
    document.getElementById('edit-task-name').value = '';
    document.getElementById('edit-date').value = '';
    editingIndex = -1;

    // Hide the edit form
    toggleForm('edit-form');

    // Update the task list display
    displayTasks();

    // Notify about the update
    notify(taskName, dateValue, true);
}
