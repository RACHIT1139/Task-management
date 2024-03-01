document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task-form");
    const taskList = document.querySelector(".task-list");
    const taskTitleInput = document.getElementById("task-title");
    const taskCategoryInput = document.getElementById("task-category");
    const taskDescriptionInput = document.getElementById("task-description");
    const reminderDays = 3; // Define how many days before the due date to show the reminder

    // Get references to elements
    const openModalButton = document.getElementById("open-feedback-modal");
    const closeModalButton = document.getElementById("close-feedback-modal");
    const modal = document.getElementById("feedback-modal");
    const feedbackForm = document.getElementById("feedback-form");
    const successMessage = document.getElementById("success-message");

    // Open modal when the "Open Feedback" button is clicked
    openModalButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Close modal when the "x" button is clicked
    closeModalButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Close modal if the user clicks outside the modal
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Handle form submission
    feedbackForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // You can send the form data to your server for further processing here
        modal.style.display = "none";

        // Show the success message with a tick animation
        successMessage.style.display = "block";
        setTimeout(function () {
            successMessage.style.display = "none";
        }, 3000); // Hide the success message after 3 seconds
    });

    let editingTask = null;

    // Function to calculate the due date
    function calculateDueDate() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + reminderDays);
        return currentDate;
    }

    // Function to check if the due date is near
    function isDueDateNear(dueDate) {
        const currentDate = new Date();
        const timeDifference = dueDate.getTime() - currentDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference <= reminderDays;
    }

    // Function to update the task list display
    function updateTaskListDisplay() {
        const taskListDisplay = document.getElementById("task-list-display");
        taskListDisplay.innerHTML = ""; // Clear the existing content

        // Loop through each task and add it to the display box
        const tasks = document.querySelectorAll(".task");
        tasks.forEach((task, index) => {
            const taskTitle = task.querySelector("h2").textContent;
            const taskCategory = task.querySelector("p strong").textContent;

            const taskItem = document.createElement("div");
            taskItem.classList.add("task-list-display-item");
            taskItem.textContent = `${index + 1}. ${taskTitle} (${taskCategory})`;

            taskListDisplay.appendChild(taskItem);
        });
    }

    // Event listener for form submission
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (editingTask) {
            editingTask.querySelector("h2").textContent = taskTitleInput.value;
            editingTask.querySelector("p strong").textContent = "Category: " + taskCategoryInput.value;
            editingTask.querySelector("p:nth-child(3)").textContent = taskDescriptionInput.value;
            editingTask = null;
        } else {
            const dueDate = calculateDueDate();
            
            const isNearDueDate = isDueDateNear(dueDate);

            const newTask = document.createElement("div");
            newTask.classList.add("task");
            newTask.innerHTML = `
                <h2>${taskTitleInput.value}</h2>
                <p><strong>Category: ${taskCategoryInput.value}</strong></p>
                <p>${taskDescriptionInput.value}</p>
                <p><strong>Due Date: ${dueDate.toLocaleDateString()}</strong></p>
                <button class="status-button complete-button">Complete</button>
                <button class="status-button incomplete-button">Not Complete</button>
                <button class="delete-button">Delete Task</button>
                <i class="fas fa-pencil-alt edit-icon"></i>
                <span class="reminder-indicator" style="display: ${isNearDueDate ? 'inline' : 'none'};">⚠️</span>
            `;

            taskList.appendChild(newTask);
        }

        taskTitleInput.value = "";
        taskCategoryInput.value = "Work";
        taskDescriptionInput.value = "";

        // Call the function to update the task list display after adding a task
        updateTaskListDisplay();
    });

    // Event listener for task list interactions
    taskList.addEventListener("click", function(event) {
        const target = event.target;

        if (target.classList.contains("complete-button")) {
            const statusSpan = target.parentElement.querySelector("p strong");
            statusSpan.textContent = "Category: " + taskCategoryInput.value + " (Completed)";
            target.classList.add("completed");
        } else if (target.classList.contains("incomplete-button")) {
            const statusSpan = target.parentElement.querySelector("p strong");
            statusSpan.textContent = "Category: " + taskCategoryInput.value;
            target.classList.remove("completed");
        } else if (target.classList.contains("delete-button")) {
            target.closest(".task").remove();
        } else if (target.classList.contains("edit-icon")) {
            const task = target.closest(".task");
            const taskTitle = task.querySelector("h2").textContent;
            const taskCategory = task.querySelector("p strong").textContent.replace("Category: ", "");
            const taskDescription = task.querySelector("p:nth-child(3)").textContent;

            taskTitleInput.value = taskTitle;
            taskCategoryInput.value = taskCategory;
            taskDescriptionInput.value = taskDescription;

            editingTask = task;
        }
    });

    // Call the function to initially populate the task list display
    updateTaskListDisplay();
});