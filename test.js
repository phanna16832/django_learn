var todo = document.getElementById("todo-name");
var time = document.getElementById("time");
var day = document.getElementById("day");
var specificDateContainer = document.getElementById("specific-date-container");
var specificDate = document.getElementById("specific-date");

day.addEventListener("change", function() {
    if (this.value === "selected-day") {
        specificDateContainer.style.display = "block";
    } else {
        specificDateContainer.style.display = "none";
    }
});

function addTask() {
    var taskName = todo.value;
    var taskTime = time.value;
    var taskDay = day.value === "selected-day" ? specificDate.value : day.value;

    if (taskName && taskTime && taskDay) {
        var taskElement = document.createElement("div");
        taskElement.innerHTML = `<p>Task: ${taskName} | Time: ${taskTime} | Day: ${taskDay}</p>`;
        document.getElementById("task-list").appendChild(taskElement);

        // Clear input fields
        todo.value = "";
        time.value = "";
        day.value = "";
        specificDate.value = "";
        specificDateContainer.style.display = "none";
    } else {
        alert("Please fill in all fields");
    }
}