import {Project, projects, currentProjectId, inputOpen, currentCategory } from './index'
import {displayTodo, todosSection} from './todo'
import { categoriesSection, displayCategoryTodos } from './category'

import editIcon from './icons/square-edit-outline.svg'
import delIcon from './icons/delete-outline.svg'
import confirmIcon from './icons/checkbox-outline.svg'
import cancelIcon from './icons/close-box-outline.svg'

export const projectsSection = document.querySelector('#projects')

export const displayProject = function(project, appendTo) {
    
    appendTo.setAttribute('class', 'category-project')
    
    const projectName = document.createElement('div')
    projectName.classList.add('project-name')
    projectName.textContent  = project.name 
    appendTo.addEventListener('mouseover', (e) => {
    btnContainer.style.visibility = 'visible'
    })
    appendTo.addEventListener('mouseout', (e) => {
        btnContainer.style.visibility = 'hidden'
        })

    appendTo.addEventListener('click', (e) => {
        if (!inputOpen) {
            currentCategory = false
            const projectsAndCategories = document.querySelectorAll('.category-project')
            projectsAndCategories.forEach((object) => {
                object.removeAttribute('id')
        })
        appendTo.setAttribute('id', 'chosen')
        todosSection.replaceChildren()
        currentProjectId = projects.indexOf(project)
        const currentTodos = projects[currentProjectId].todos
        currentTodos.forEach((todo) => {
            const todoCard = document.createElement('div')
            todoCard.classList.add(`${todo.priority}`)
            todoCard.classList.add('todo-card')
            displayTodo(todo, todoCard)
            todosSection.appendChild(todoCard)
            })
        }
    })

    const btnContainer = document.createElement('div')

    const editBtn = document.createElement('button')
    
    editBtn.style.backgroundImage = `url(${editIcon})`
    editBtn.addEventListener('click', (e)  => {   
        if (!inputOpen) {
            inputOpen = true
            const projectCard = e.target.parentElement.parentElement
            projectCard.replaceChildren() 
            displayProjectDataInput(`${project.name}`, `${project.name}`, projectCard, confirmEditProject, discardEditProject)
            projectCard.firstChild.focus()
    }})

    const confirmEditProject = function(e, nameInput) { 
        const projectCard = e.target.parentElement.parentElement
        projectCard.replaceChildren() 
        e.stopPropagation()
        project.name = nameInput.value
        
        displayProject(project, projectCard)
        inputOpen = false  
    }

    const discardEditProject = function(e) { 
        e.stopPropagation()       
        const projectCard = e.target.parentElement.parentElement
        projectCard.replaceChildren() 
        displayProject(project, projectCard)
        inputOpen = false  
    }

    const deleteBtn = document.createElement('button')
    
    deleteBtn.style.backgroundImage = `url(${delIcon})`
    deleteBtn.addEventListener('click', (e) => {
        if (projects.indexOf(project) == currentProjectId) {
            currentProjectId = 0
            categoriesSection.firstChild.setAttribute('id', 'chosen')
            todosSection.replaceChildren()
            projects[0].todos.forEach((todo) => displayCategoryTodos(todo))
        }
        e.stopPropagation()
        e.target.parentElement.parentElement.remove() 
        projects.splice(projects.indexOf(project), 1)
        
    })
   
    appendTo.appendChild(projectName)
    btnContainer.appendChild(editBtn)
    btnContainer.appendChild(deleteBtn)
    appendTo.appendChild(btnContainer)
    btnContainer.style.visibility='hidden'
    
}


const addProjectBtn = document.querySelector('#add-project')
addProjectBtn.addEventListener('click', () => {
    if (!inputOpen) {
        inputOpen = true
        const projectCard = document.createElement('div')
        displayProjectDataInput('', 'New Project', projectCard, confirmNewProject, discardNewProject)
        projectsSection.appendChild(projectCard)
        projectCard.firstChild.focus()
    }
})


const displayProjectDataInput = function(nameValue, namePlaceholder, appendTo, confirmBtnFunction, discardBtnFunction) {
    
    appendTo.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
          confirmBtn.click();
        }
        else if (event.key === "Escape") {
            discardBtn.click();
          }
      })
    const nameInput = document.createElement('input') 
    const btnContainer = document.createElement('div')
    btnContainer.classList.add('btnContainer')
    const confirmBtn = document.createElement('button')
    const discardBtn = document.createElement('button')
    confirmBtn.style.backgroundImage = `url(${confirmIcon})`
    discardBtn.style.backgroundImage = `url(${cancelIcon})`
    
    confirmBtn.addEventListener('click', (e) => confirmBtnFunction(e, nameInput)) 
    discardBtn.addEventListener('click', (e) => discardBtnFunction(e))

    nameInput.setAttribute('placeholder', namePlaceholder)
    
    nameInput.value = nameValue
    appendTo.appendChild(nameInput)
    appendTo.appendChild(btnContainer)
    btnContainer.appendChild(confirmBtn)
    btnContainer.appendChild(discardBtn)

}

const confirmNewProject = function(e, nameInput) {     
    let newProject = new Project(`${nameInput.value}`)
    projects.push(newProject)
    
    e.target.parentElement.parentElement.remove() 
    const projectCard = document.createElement('div')
    displayProject(newProject, projectCard)  
    projectsSection.appendChild(projectCard)
    inputOpen = false  
}

const discardNewProject = function(e) {
    e.target.parentElement.parentElement.remove()
    inputOpen = false 
}