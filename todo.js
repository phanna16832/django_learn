        // ... (previous script content up to the notify function remains unchanged) ...
        // Check if the browser supports Notification API
        if ("Notification" in window) {
            console.log('Notification API supported');
           
            // Request notification permission if not already granted
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                console.log('Requesting notification permission');
                Notification.requestPermission().then((res) => {
                    console.log(`Notification permission result: ${res}`);
                    if (res === 'granted') {
                        console.log('Notification permission granted');
                    } else if (res === 'denied') {
                        console.log('Notification access denied');
                    } else if (res === 'default') {
                        console.log('Notification permission not given');
                    }
                });
            }
        } else {
            console.log('Notification API not supported');
        }

        // Array to store tasks
        let tasks = [];
        let editingIndex = -1;

        // Notify the user
        function notify(taskName, dateValue, isUpdate = false, isDue = false) {
            console.log('Creating notification...');
            let title, body;
            if (isDue) {
                title = `Task Due: ${taskName}`;
                body = `This task is now due!`;
            } else {
                title = isUpdate ? `Task Updated: ${taskName}` : `New Task Added: ${taskName}`;
                body = `Due on: ${dateValue}`;
            }
            const notification = new Notification(title, {
                body: body,
                icon: '/api/placeholder/64/64', // Placeholder icon
                tag: isDue ? "due-task" : (isUpdate ? "update-task" : "new-task"),
                vibrate: [200, 100, 200],
            });
            setTimeout(() => {
                notification.close();
            }, 5000);
        }

        // Display tasks in the DOM
        function displayTasks() {
            const tasksContainer = document.getElementById('tasks-container');
            tasksContainer.innerHTML = '';
            tasks.forEach((task, index) => {
                const taskElement = document.createElement('div');
                taskElement.className = 'todo-item';
                taskElement.innerHTML = `
                    <span>${task.name} - Due: ${new Date(task.date).toLocaleString()}</span>
                    <div>
                        <button onclick="editTask(${index})">Edit</button>
                        <button onclick="removeTask(${index})">Remove</button>
                    </div>
                `;
                tasksContainer.appendChild(taskElement);
            });
        }

        // ... (edit and remove task functions remain unchanged) ...

        // Check for due tasks and notify
        function checkDueTasks() {
            const now = new Date();
            tasks.forEach(task => {
                const dueDate = new Date(task.date);
                if (dueDate <= now && !task.notified) {
                    notify(task.name, task.date, false, true);
                    task.notified = true;
                    saveTasks(); // Save the updated task state
                }
            });
        }

        // Load tasks when the page loads
        window.onload = function() {
            loadTasks();
            // Check for due tasks every minute
            setInterval(checkDueTasks, 60000);
        };

        // ... (loadTasks, saveTasks, toggleForm functions remain unchanged) ...

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