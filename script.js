// 1. По нажатию на кнопку "получить задачи" мы получаем список задач.
// 2. Отрендерить задачи, создав их элементы динамически
// 3. Реализовать удаление из списка отдельной задачи
// 4. Реализовать изменение статуса задачи
// 5. Реализовать добавление новой задачи
// 6. Реализовать обновление текста существующей задачи
// 7. overlay, spinner

const container = document.getElementById("posts-container");
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const downLoadButton = document.querySelector(".button-download");
const overlay = document.getElementById("overlay");

const host = 'https://6730692566e42ceaf1603670.mockapi.io/api/v1/todos'

async function getData() {
    try {
        showLoader()
        const response = await fetch(host,
            {
                method: "GET",
            });
        if (!response.ok) {
            throw new Error(`Failed to fetch data. ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        renderData(data)
    } catch (error) {
        console.error(`Ошибка:`, error.message);
    }finally {
        hideLoader()
    }

    function renderData(todos) {
        container.innerHTML = '';
        todos.forEach((todo) => {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo');

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;

            checkbox.addEventListener("change", () => {
                toggleTodoStatus(todo.id, checkbox.checked)
            })

            const textElement = document.createElement("p");
            textElement.textContent = todo.text;

            const timeElement = document.createElement("p");
            timeElement.textContent = new Date(todo.createdAt).toLocaleString('ru-Ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add('button-function');

            const deleteIcon = document.createElement("img");
            deleteIcon.src = './images/icon-delete.png';
            deleteIcon.alt = 'delete';
            deleteIcon.title = 'delete';

            deleteButton.append(deleteIcon);
            deleteButton.addEventListener("click", () => {
                deleteTodo(todo.id)
            })

            const updateButton = document.createElement("button");
            updateButton.classList.add('button-function');

            const updateIcon = document.createElement("img");
            updateIcon.src = './images/icon-update.png';
            updateIcon.alt = 'update';
            updateIcon.title = 'update';

            updateButton.append(updateIcon)

            updateButton.addEventListener("click", () => {
                const newText = prompt(
                    `Введите новый текст задачи: `, todo.text);
                if (newText){
                    updateTodo(todo.id, newText)
                }
            })

            todoElement.append(checkbox, textElement, timeElement, deleteButton, updateButton);

            container.append(todoElement);
        })
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${host}/${id}`, {
            method: "DELETE",
        })
        if (!response.ok) {
            throw new Error(`Failed to delete data. Status: ${response.status}`);
        }
        //console.log('Task is deleted:', data);
        await getData()
    } catch (error) {
        console.error(`Ошибка:`, error.message);
    }
}

async function addTodo() {
    const newTodoText = taskInput.value.trim();

    if (!newTodoText) {
        alert("Введите текст задачи!");
        return;
    }

    const newTodo = {
        text: newTodoText,
        createdAt: Date.now(),
        completed: false,
    };

    try {
        const response = await fetch(`${host}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
            throw new Error(`Не удалось добавить задачу. Статус: ${response.status}`);
        }

        console.log("Задача добавлена");
        taskInput.value = ""; // Еще очищаем поле ввода новой задачи
        getData();
    } catch (error) {
        console.error(`Ошибка добавления:`, error.message);
    }
}

async function toggleTodoStatus(id, completed) {
    try {
        const response = await fetch(`${host}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({completed}),
        })
        if (!response.ok) {
            throw new Error(`Failed to delete data. Status: ${response.status}`);
        }

        await getData()
    } catch (error) {
        console.error('Update is wrong', error.message);
    }
}

async function updateTodo(id, newText) {

    try {
        const response = await fetch(`${host}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text: newText}),
        });

        if (!response.ok) {
            throw new Error(`Не удалось обновить задачу. Статус: ${response.status}`);
        }

        console.log("Текст добавлен"); // Еще очищаем поле ввода новой задачи
        await getData();
    } catch (error) {
        console.error(`Ошибка добавления текста:`, error.message);
    }
}

addButton.addEventListener("click", addTodo);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

downLoadButton.addEventListener("click", getData);

function showLoader(){
    overlay.style.display = "flex";
}
function hideLoader(){
    overlay.style.display = "none";
}