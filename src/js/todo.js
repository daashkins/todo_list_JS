const input = document.querySelector('#add__todo');
const form = document.querySelector('form');
const list = document.querySelector('.todo__list');
const existingTodos = JSON.parse(window.localStorage.getItem('todos'));
const toDos = existingTodos || [];

const createLi = (toDo) => {
  const li = document.createElement('li');
  li.setAttribute('id', toDo.id);
  li.classList.add('todo__item');
  return li;
};

const createCheckbox = (toDo) => {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'todo__checkbox');
  checkbox.setAttribute('id', `checkbox${toDo.id}`);
  checkbox.setAttribute('data-testid', 'todoItem');
  checkbox.checked = toDo.completed;
  return checkbox;
};

const createLabel = (toDo) => {
  const label = document.createElement('label');
  label.setAttribute('for', `checkbox${toDo.id}`);
  label.setAttribute('class', 'todo__name');
  label.textContent = toDo.name;
  return label;
};

const createDeleteButton = () => {
  const button = document.createElement('button');
  button.setAttribute('data-testid', 'btnDeleteTodo');
  button.setAttribute('class', 'todo__delete');
  button.innerHTML = '<i class="fa-solid fa-trash"></i>';
  return button;
};

const updateClassName = (checkbox, parent) => {
  if (checkbox.checked === true) {
    parent.classList.add('todo__item--completed');
  } else {
    parent.classList.remove('todo__item--completed');
  }
};

const createToDoCart = (toDo) => {
  const li = createLi(toDo);
  const checkbox = createCheckbox(toDo);
  const label = createLabel(toDo);
  updateClassName(checkbox, li);

  li.appendChild(checkbox);
  li.appendChild(label);

  if (toDo.completed === true) {
    const button = createDeleteButton(toDo);
    li.appendChild(button);
  }

  list.appendChild(li);
};

const saveToLocalStorage = (data) => {
  window.localStorage.setItem('todos', JSON.stringify(data));
};

const addToDo = (toDo) => {
  if (toDo) {
    const item = {
      id: new Date().getTime(),
      name: toDo,
      completed: false,
    };
    toDos.push(item);
    saveToLocalStorage(toDos);
  }
};

const renderToDos = () => {
  const open = toDos.filter((element) => element.completed === false);
  const completed = toDos.filter((element) => element.completed === true);

  open.forEach((todo) => {
    createToDoCart(todo);
  });
  completed.forEach((todo) => {
    createToDoCart(todo);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderToDos();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addToDo(input.value);
  input.value = '';
  list.innerHTML = '';
  renderToDos();
});

const updateStatusInLocalStorage = (id, checkbox) => {
  const indexOfUpdatedItem = toDos.findIndex((toDo) => {
    const toDoId = toDo.id.toString();
    return toDoId === id;
  });
  if (indexOfUpdatedItem >= 0) {
    toDos[indexOfUpdatedItem].completed = checkbox.checked;
  }
  saveToLocalStorage(toDos);
};

const deleteItemFromLocalStorage = (id) => {
  const indexOfUpdatedItem = toDos.findIndex((toDo) => {
    const toDoId = toDo.id.toString();
    return toDoId === id;
  });
  if (indexOfUpdatedItem >= 0) {
    toDos.splice(indexOfUpdatedItem, 1);
  }
  saveToLocalStorage(toDos);
};

list.addEventListener('change', (e) => {
  const clicked = e.target;
  const listItem = e.target.parentElement;
  if (clicked.type === 'checkbox') {
    updateStatusInLocalStorage(listItem.id, clicked);
    list.innerHTML = '';
    renderToDos(toDos);
  }
});

list.addEventListener('click', (e) => {
  const button = e.target.parentElement;
  const li = button.parentElement;
  if (button.getAttribute('data-testid') === 'btnDeleteTodo') {
    deleteItemFromLocalStorage(li.id);
    list.innerHTML = '';
    renderToDos(toDos);
  }
});
