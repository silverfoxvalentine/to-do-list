import {currentCategory, currentProjectId, inputOpen, projects} from './index'
import {todosSection, displayTodo} from './todo'
import { isToday,  isThisWeek } from "date-fns";

const categoriesSection = document.querySelector('#categories')


const displayCategory = function(category, categoryFunction) {
    const categoryCard = document.createElement('div')
    categoryCard.setAttribute('class', 'category-project')
    const categoryName = document.createElement('div')
    categoryName.textContent  = category.name    
    categoryCard.appendChild(categoryName)
    categoriesSection.appendChild(categoryCard)
    categoryCard.addEventListener('click', (e) => {
        if (!inputOpen) {
        const projectsAndCategories = document.querySelectorAll('.category-project')
        projectsAndCategories.forEach((object) => {
            object.removeAttribute('id')
        })
        categoryCard.setAttribute('id', 'chosen')
        todosSection.replaceChildren()
        categoryFunction()
    }})
}

const nonProjectTasksFunction = function() {
    
    todosSection.replaceChildren()
    currentProjectId = 0
    
    currentCategory = ''
    projects[0].todos.forEach((todo) => displayCategoryTodos(todo))
}

const allTasksFunction = function() {
    todosSection.replaceChildren()
    currentCategory = 0
    
    projects.forEach((project) => {
        project.todos.forEach((todo) => displayCategoryTodos(todo))
    })
}

const todayTasksFuncion = function() {
    currentCategory = 1
    projects.forEach((project) => {
        project.todos.filter((todo) => isToday(todo.date))
        .forEach((todo) => displayCategoryTodos(todo))
    })

}

const thisWeekTasksFunction = function() {
    currentCategory = 2
    projects.forEach((project) => {
        project.todos.filter((todo) => isThisWeek(todo.date))
        .forEach((todo) => displayCategoryTodos(todo))
    })

}


const displayCategoryTodos = function(todo) {
    const todoCard = document.createElement('div')
    todoCard.classList.add('todo-card')
    todoCard.classList.add(`${todo.priority}`)
    displayTodo(todo, todoCard)
    todosSection.appendChild(todoCard)
}


export { categoriesSection, displayCategory, nonProjectTasksFunction, allTasksFunction, todayTasksFuncion, thisWeekTasksFunction, displayCategoryTodos }