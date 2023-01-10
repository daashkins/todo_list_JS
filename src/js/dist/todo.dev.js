"use strict";

var input = document.querySelector('#add__todo');
var form = document.querySelector('form');
var list = document.querySelector('.todo__list');
var existingTodos = JSON.parse(window.localStorage.getItem('todos'));
var toDos = existingTodos || [];

var createLi = function createLi(toDo) {
  var li = document.createElement('li');
  li.setAttribute('id', toDo.id);
  li.classList.add('todo__item');
  return li;
};

var createCheckbox = function createCheckbox(toDo) {
  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'todo__checkbox');
  checkbox.setAttribute('id', "checkbox".concat(toDo.id));
  checkbox.setAttribute('data-testid', 'todoItem');
  checkbox.checked = toDo.completed;
  return checkbox;
};

var createLabel = function createLabel(toDo) {
  var label = document.createElement('label');
  label.setAttribute('for', "checkbox".concat(toDo.id));
  label.setAttribute('class', 'todo__name');
  label.textContent = toDo.name;
  return label;
};

var createDeleteButton = function createDeleteButton() {
  var button = document.createElement('button');
  button.setAttribute('data-testid', 'btnDeleteTodo');
  button.setAttribute('class', 'todo__delete');
  button.innerHTML = '<i class="fa-solid fa-trash"></i>';
  return button;
};

var updateClassName = function updateClassName(checkbox, parent) {
  if (checkbox.checked === true) {
    parent.classList.add('todo__item--completed');
  } else {
    parent.classList.remove('todo__item--completed');
  }
};

var createToDoCart = function createToDoCart(toDo) {
  var li = createLi(toDo);
  var checkbox = createCheckbox(toDo);
  var label = createLabel(toDo);
  updateClassName(checkbox, li);
  li.appendChild(checkbox);
  li.appendChild(label);

  if (toDo.completed === true) {
    var button = createDeleteButton(toDo);
    li.appendChild(button);
  }

  list.appendChild(li);
};

var saveToLocalStorage = function saveToLocalStorage(data) {
  window.localStorage.setItem('todos', JSON.stringify(data));
};

var addToDo = function addToDo(toDo) {
  if (toDo) {
    var item = {
      id: new Date().getTime(),
      name: toDo,
      completed: false
    };
    toDos.push(item);
    saveToLocalStorage(toDos);
  }
};

var renderToDos = function renderToDos() {
  var open = toDos.filter(function (element) {
    return element.completed === false;
  });
  var completed = toDos.filter(function (element) {
    return element.completed === true;
  });
  open.forEach(function (todo) {
    createToDoCart(todo);
  });
  completed.forEach(function (todo) {
    createToDoCart(todo);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  renderToDos();
});
form.addEventListener('submit', function (e) {
  e.preventDefault();
  addToDo(input.value);
  input.value = '';
  list.innerHTML = '';
  renderToDos();
});

var updateStatusInLocalStorage = function updateStatusInLocalStorage(id, checkbox) {
  var indexOfUpdatedItem = toDos.findIndex(function (toDo) {
    var toDoId = toDo.id.toString();
    return toDoId === id;
  });

  if (indexOfUpdatedItem >= 0) {
    toDos[indexOfUpdatedItem].completed = checkbox.checked;
  }

  saveToLocalStorage(toDos);
};

var deleteItemFromLocalStorage = function deleteItemFromLocalStorage(id) {
  var indexOfUpdatedItem = toDos.findIndex(function (toDo) {
    var toDoId = toDo.id.toString();
    return toDoId === id;
  });

  if (indexOfUpdatedItem >= 0) {
    toDos.splice(indexOfUpdatedItem, 1);
  }

  saveToLocalStorage(toDos);
};

list.addEventListener('change', function (e) {
  var clicked = e.target;
  var listItem = e.target.parentElement;

  if (clicked.type === 'checkbox') {
    updateStatusInLocalStorage(listItem.id, clicked);
    list.innerHTML = '';
    renderToDos(toDos);
  }
});
list.addEventListener('click', function (e) {
  var button = e.target.parentElement;
  var li = button.parentElement;

  if (button.getAttribute('data-testid') === 'btnDeleteTodo') {
    deleteItemFromLocalStorage(li.id);
    list.innerHTML = '';
    renderToDos(toDos);
  }
});