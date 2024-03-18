/* eslint-disable max-classes-per-file */
import './style.css';
import {
  categoriesSection,
  displayCategory,
  nonProjectTasksFunction,
  allTasksFunction,
  todayTasksFuncion,
  thisWeekTasksFunction,
} from './category';
import { displayProject, projectsSection } from './project';
import { displayTodo, todosSection } from './todo';

export let projects = [];
const categories = [];

class Category {
  constructor(name) {
    this.name = name;
  }
}

const allTasks = new Category('All Tasks');
categories.push(allTasks);
const nonProjectTasks = new Category('Non Project Tasks');
nonProjectTasks.todos = [];
projects.push(nonProjectTasks);
const todayTasks = new Category('Today Tasks');
categories.push(todayTasks);
const thisWeekTasks = new Category('This Week Tasks');
categories.push(thisWeekTasks);
export class Project {
  constructor(name) {
    this.name = name;
  }

  todos = [];
}

export class Todo {
  constructor(name, description, date, priority, project, completed) {
    this.name = name;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.project = project;
    this.completed = completed;
  }
}

export let inputOpen = false;
export let currentProjectId = 0;
export let currentCategory;
displayCategory(nonProjectTasks, nonProjectTasksFunction);
displayCategory(allTasks, allTasksFunction);
displayCategory(todayTasks, todayTasksFuncion);
displayCategory(thisWeekTasks, thisWeekTasksFunction);
categoriesSection.firstChild.setAttribute('id', 'chosen');
export const changeStorage = function () {
  let projectInStorage = projects;
  projectInStorage.forEach((project) => {
    project.todos.forEach((todo) => {
      todo = JSON.stringify(todo);
    });

    project = JSON.stringify(project);
  });

  projectInStorage = JSON.stringify(projectInStorage);
  localStorage.setItem('projects', projectInStorage);
};

const parseStorage = function () {
  projects = JSON.parse(localStorage.getItem('projects'));
};

if (!localStorage.getItem('projects')) {
  // adding an example project
  const projectExample = new Project('Project');
  projects.push(projectExample);
  const projectCard = document.createElement('div');
  displayProject(projectExample, projectCard);
  projectsSection.appendChild(projectCard);
  //
  changeStorage();
} else {
  parseStorage();
  projects.forEach((project) => {
    if (projects.indexOf(project) > 0) {
      const projectCard = document.createElement('div');
      displayProject(project, projectCard);
      projectsSection.appendChild(projectCard);
    }
  });
}

const mainSection = document.querySelector('#main');
const observer = new MutationObserver(() => changeStorage());
observer.observe(mainSection, {
  childList: true,
  subtree: true,
  attributes: true,
});

projects[0].todos.forEach((todo) => {
  const todoCard = document.createElement('div');
  todoCard.classList.add('todo-card');
  todoCard.classList.add(`${todo.priority}`);
  displayTodo(todo, todoCard);
  todosSection.appendChild(todoCard);
});
