import { Todo, projects, currentProjectId, inputOpen, currentCategory } from './index';
import { format, parseISO, isToday, isThisWeek } from 'date-fns';

import editIcon from './icons/circle-edit-outline.svg';
import delIcon from './icons/delete-outline.svg';
import confirmIcon from './icons/check-circle-outline.svg';
import cancelIcon from './icons/close-circle-outline.svg';

export const todosSection = document.querySelector('#todos');
export const displayTodo = function (todo, appendDataTo) {
  const finishedCheckbox = document.createElement('input');
  finishedCheckbox.setAttribute('type', 'checkbox');
  finishedCheckbox.checked = todo.completed;
  if (todo.completed) appendDataTo.classList.add('completed');
  finishedCheckbox.addEventListener('change', () => {
    if (finishedCheckbox.checked) {
      todo.completed = true;
      appendDataTo.classList.add('completed');
    } else {
      todo.completed = false;
      appendDataTo.classList.remove('completed');
    }
  });
  const todoName = document.createElement('div');
  const todoDescription = document.createElement('div');
  const todoSecondColumn = document.createElement('div');
  const priority = document.createElement('div');
  const date = document.createElement('div');
  todoName.textContent = todo.name;
  todoDescription.textContent = todo.description;
  priority.textContent = todo.priority;
  if (todo.date) {
    date.value = todo.date;
    date.textContent = format(parseISO(todo.date), 'dd/MM/yyyy');
  }

  const editBtn = document.createElement('button');
  editBtn.style.backgroundImage = `url(${editIcon})`;
  editBtn.addEventListener('click', (e) => {
    if (!inputOpen) {
      inputOpen = true;
      const todoCard = e.target.parentElement.parentElement;
      todoCard.classList.remove('todo-card');
      todoCard.classList.remove(`${todo.priority}`);
      todoCard.classList.add('todo-input');
      todoCard.replaceChildren();
      displayTodoDataInput(
        `${todo.name}`,
        `${todo.name}`,
        `${todo.description}`,
        `${todo.description}`,
        `${todo.date}`,
        `${todo.priority}`,
        `${todo.project}`,
        todoCard,
        confirmEditTodo,
        discardEditTodo,
      );
      todoCard.firstChild.focus();
      todoCard.addEventListener('keyup', (event) => keyHandler(event));
    }
  });

  const confirmEditTodo = function (
    e,
    nameInput,
    descriptionInput,
    priorityChoice,
    projectChoice,
    dateInput,
  ) {
    const editedTodo = new Todo(
      nameInput.value,
      descriptionInput.value,
      dateInput.value,
      priorityChoice.value,
      projectChoice.value,
      todo.completed,
    );
    const todoCard = e.target.parentElement.parentElement;
    todoCard.classList.remove('todo-input');
    todoCard.classList.add('todo-card');
    todoCard.classList.add(`${priorityChoice.value}`);
    todoCard.replaceChildren();
    const todoIndex = projects[todo.project].todos.indexOf(todo);
    projects[todo.project].todos.splice(todoIndex, 1);
    if ((editedTodo.project == currentProjectId && !currentCategory)
    || (currentCategory === 0)
    || (currentCategory === 1 && isToday(editedTodo.date))
    || (currentCategory === 2 && isThisWeek(editedTodo.date))) {
      displayTodo(editedTodo, todoCard);
      projects[projectChoice.value].todos.splice(todoIndex, 0, editedTodo);
    } else {
      todoCard.remove();
      projects[projectChoice.value].todos.push(editedTodo);
    }

    inputOpen = false;
  };

  const discardEditTodo = function (e) {
    const todoCard = e.target.parentElement.parentElement;
    todoCard.replaceChildren();
    todoCard.classList.remove('todo-input');
    todoCard.classList.add('todo-card');
    todoCard.classList.add(`${todo.priority}`);
    displayTodo(todo, todoCard);
    inputOpen = false;
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.style.backgroundImage = `url(${delIcon})`;
  deleteBtn.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.remove();
    projects[todo.project].todos.splice(projects[todo.project].todos.indexOf(todo), 1);
  });

  appendDataTo.appendChild(finishedCheckbox);
  appendDataTo.appendChild(todoName);
  todoSecondColumn.appendChild(date);
  todoSecondColumn.appendChild(priority);
  todoSecondColumn.appendChild(editBtn);
  todoSecondColumn.appendChild(deleteBtn);
  appendDataTo.appendChild(todoSecondColumn);
  if (todo.description) appendDataTo.appendChild(todoDescription);
};

const addTodo = document.querySelector('#add-to-do');
addTodo.addEventListener('click', () => {
  if (!inputOpen) {
    inputOpen = true;
    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-input');
    displayTodoDataInput(
      '',
      'New To-do',
      '',
      'Description',
      '',
      'Medium',
      currentProjectId,
      todoCard,
      confirmNewTodo,
      discardNewTodo,
    );
    todosSection.appendChild(todoCard);
    todoCard.firstChild.focus();
    todoCard.addEventListener('keyup', (e) => keyHandler(e));
  }
});

const keyHandler = function (event) {
  const confirmBtn = document.querySelector('#confirmBtn');
  const discardBtn = document.querySelector('#discardBtn');
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    confirmBtn.click();
  } else if (event.key === 'Escape') {
    discardBtn.click();
  }
};

const displayTodoDataInput = function (
  name,
  namePlaceholder,
  description,
  descriptionPlaceholder,
  date,
  priority,
  project,
  appendInputTo,
  confirmBtnFunction,
  discardBtnFunction,
) {
  const nameInput = document.createElement('input');
  const descriptionInput = document.createElement('textarea');
  const thirdLine = document.createElement('div');
  const priorityChoice = document.createElement('select');
  const highPriority = document.createElement('option');
  const mediumPriority = document.createElement('option');
  const lowPriority = document.createElement('option');
  highPriority.textContent = 'High';
  mediumPriority.textContent = 'Medium';
  lowPriority.textContent = 'Low';
  priorityChoice.appendChild(highPriority);
  priorityChoice.appendChild(mediumPriority);
  priorityChoice.appendChild(lowPriority);
  const projectChoice = document.createElement('select');
  projects.forEach((project) => {
    const projectOption = document.createElement('option');
    projectOption.textContent = project.name;
    projectOption.value = projects.indexOf(project);
    projectChoice.appendChild(projectOption);
  });

  const dateInput = document.createElement('input');
  dateInput.setAttribute('type', 'date');
  const confirmBtn = document.createElement('button');
  const discardBtn = document.createElement('button');
  confirmBtn.setAttribute('id', 'confirmBtn');
  discardBtn.setAttribute('id', 'discardBtn');
  confirmBtn.style.backgroundImage = `url(${confirmIcon})`;
  discardBtn.style.backgroundImage = `url(${cancelIcon})`;
  nameInput.value = name;
  nameInput.setAttribute('placeholder', namePlaceholder);
  descriptionInput.value = description;
  descriptionInput.setAttribute('placeholder', descriptionPlaceholder);
  priorityChoice.value = priority;
  projectChoice.value = project;
  dateInput.value = date;
  appendInputTo.appendChild(nameInput);
  appendInputTo.appendChild(descriptionInput);
  thirdLine.appendChild(priorityChoice);
  thirdLine.appendChild(projectChoice);
  thirdLine.appendChild(dateInput);
  appendInputTo.appendChild(thirdLine);
  thirdLine.appendChild(confirmBtn);
  thirdLine.appendChild(discardBtn);
  confirmBtn.addEventListener('click', (e) => confirmBtnFunction(
    e,
    nameInput,
    descriptionInput,
    priorityChoice,
    projectChoice,
    dateInput,
  ));
  discardBtn.addEventListener('click', (e) => discardBtnFunction(e));
};

const confirmNewTodo = function (
  e,
  nameInput,
  descriptionInput,
  priorityChoice,
  projectChoice,
  dateInput,
) {
  const newTodo = new Todo(
    `${nameInput.value}`,
    `${descriptionInput.value}`,
    `${dateInput.value}`,
    `${priorityChoice.value}`,
    `${projectChoice.value}`,
    false,
  );
  projects[projectChoice.value].todos.push(newTodo);
  e.target.parentElement.parentElement.remove();
  inputOpen = false;
  if ((newTodo.project == currentProjectId && !currentCategory)
  || (currentCategory === 0)
  || (currentCategory === 1 && isToday(newTodo.date))
  || (currentCategory === 2 && isThisWeek(newTodo.date))) {
    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');
    todoCard.classList.add(`${priorityChoice.value}`);
    displayTodo(newTodo, todoCard);
    todosSection.appendChild(todoCard);
  }
};

const discardNewTodo = function (e) {
  e.target.parentElement.parentElement.remove();
  inputOpen = false;
};
