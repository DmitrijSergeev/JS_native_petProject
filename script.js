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

async function getData (){
    try{
        const response = await fetch("https://6730692566e42ceaf1603670.mockapi.io/api/v1/todos",
            {
            method: "GET",
        }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch data. ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        renderData(data)
    }catch (error){
        console.error(`Ошибка:`, error.message);
    }
    function renderData (todos){
        todos.forEach((todo)=>{
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo');

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;

            const textElement = document.createElement("p");
            textElement.textContent = todo.text;

            const timeElement = document.createElement("p");
            timeElement.textContent = new Date(todo.createdAt).toLocaleString('ru-Ru',{
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


            const updateButton = document.createElement("button");
            updateButton.classList.add('button-function');

            const updateIcon = document.createElement("img");
            updateIcon.src = './images/icon-update.png';
            updateIcon.alt = 'update';
            updateIcon.title = 'update';

            updateButton.append(updateIcon)

            todoElement.append(checkbox, textElement, timeElement, deleteButton, updateButton);

            container.append(todoElement);
        })
    }
}
downLoadButton.addEventListener("click", getData);