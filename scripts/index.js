// Достаем из local storage записанные данные

const initDataTodo = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

const updateDataTodo = (key, todoData) =>
localStorage.setItem(key, JSON.stringify(todoData));

// Создание и вывод конструкции приложения

const createTodo = (title, form, list) => {
  const todoContainer = document.createElement("div");
  const todoRow = document.createElement("div");
  const todoHeader = document.createElement("h1");
  const wrapperForm = document.createElement("div");
  const wrapperList = document.createElement("div");

  todoContainer.classList.add("container");
  todoRow.classList.add("row");
  todoHeader.classList.add("text-center", "mb-5");
  wrapperForm.classList.add("col-6");
  wrapperList.classList.add("col-6");

  todoHeader.textContent = title;

  wrapperForm.append(form);
  wrapperList.append(list);
  todoRow.append(wrapperForm, wrapperList);

  todoContainer.append(todoHeader, todoRow);
  return todoContainer;
};

// Создание формы и инпутов для вноса дел в список

const createFormTodo = () => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const textArea = document.createElement("textarea");
  const btnSubmit = document.createElement("button");

  input.placeholder = "Наименование";
  textArea.placeholder = "Описание";

  btnSubmit.type = "submit";
  btnSubmit.textContent = "Добавить";

  form.classList.add("form-group");
  input.classList.add("form-control", "mb-3");
  textArea.classList.add("form-control", "mb-3");
  btnSubmit.classList.add("btn", "btn-primary", "lg", "btn-block");

  form.append(input, textArea, btnSubmit);

  return { input, textArea, btnSubmit, form };
};

//Создание правой части приложения - списка внесенных дел

const createListTodo = () => {
  const listTodo = document.createElement("ul");
  listTodo.classList.add("list-group");
  return listTodo;
};

// Создание "КНОПКИ-ДЕЛА" дело - itemTodo содержит кнопку btnItem, на которой написан заголовок дела

const createItemTodo = (item, listTodo) => {
  const itemTodo = document.createElement("li");
  const btnItem = document.createElement("button");

  itemTodo.classList.add("list-group-item", "p-0", "mb-3", "border-0");
  btnItem.classList.add(
    "btn",
    "btn-block",
    "border-primary",
    "rounded-pill",
    "list-item",
    item.success ? "btn-success" : "btn-light"
  );
  btnItem.textContent = item.nameTodo;
  btnItem.id = item.id;

  itemTodo.append(btnItem);
  listTodo.append(itemTodo);
  return itemTodo;
};

//Добавляем дело и обновляем список дел. Создаем массив объектов с переданными свойствами.

const addTodoItem = (key, todoData, listTodo, nameTodo, descriptionTodo) => {
  const id = `todo${(+new Date()).toString(16)}`;
  todoData.push({ id, nameTodo, descriptionTodo, success: false });
  updateTodo(listTodo, todoData, key);
};

const createModal = () => {
  const modalWindow = document.createElement("div");
  const modalDialog = document.createElement("div");
  const modalContent = document.createElement("div");
  const modalHeader = document.createElement("div");
  const modalBody = document.createElement("div");
  const modalFooter = document.createElement("div");
  const itemTitle = document.createElement("h2");
  const itemDescription = document.createElement("p");
  const btnClose = document.createElement("button");
  const btnReady = document.createElement("button");
  const btnDelete = document.createElement("button");

  modalWindow.classList.add("modal");
  modalDialog.classList.add("modal-dialog");
  modalContent.classList.add("modal-content");
  modalHeader.classList.add("modal-header");
  modalBody.classList.add("modal-body");
  modalFooter.classList.add("modal-footer");
  itemTitle.classList.add("modal-title");
  btnClose.classList.add("close", "btn-modal");
  btnReady.classList.add("btn", "btn-success", "btn-modal");
  btnDelete.classList.add("btn", "btn-danger", "btn-delete", "btn-modal");

  btnClose.innerHTML = "&times";
  btnReady.textContent = "Выполнено";
  btnDelete.textContent = "Удалить";

  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(itemTitle, btnClose);
  modalBody.append(itemDescription);
  modalFooter.append(btnReady, btnDelete);

  modalWindow.append(modalDialog);

  const closeModal = event => {
    const target = event.target;
    console.log(target);
    if (target.classList.contains("btn-modal") || target === modalWindow) {
      modalWindow.classList.remove("d-block");
    }
  };

  const showModal = (titleTodo, descriptionTodo, id) => {
    modalWindow.dataset.idItem = id;
    modalWindow.classList.add("d-block");
    itemTitle.textContent = titleTodo;
    itemDescription.textContent = descriptionTodo;
  };
  modalWindow.addEventListener("click", closeModal);
  return { modalWindow, btnReady, btnDelete, showModal };
};

const updateTodo = (listTodo, todoData, key) => {
  listTodo.textContent = "";
  todoData.forEach((item) => createItemTodo(item, listTodo));
  updateDataTodo(key, todoData);
};

const initTodo = (selector) => {
  const key = prompt('Привет! Введите свое имя');
  const todoData = initDataTodo(key);
  const wrapper = document.querySelector(selector);
  const formTodo = createFormTodo();
  const listTodo = createListTodo();
  const modal = createModal();
  const todoApp = createTodo(key, formTodo.form, listTodo);

  document.body.append(modal.modalWindow);
  wrapper.append(todoApp);

  formTodo.form.addEventListener("submit", (e) => {
    e.preventDefault();
    formTodo.input.classList.remove("is-invalid");
    formTodo.textArea.classList.remove("is-invalid");

    if (formTodo.input.value.trim() && formTodo.textArea.value) {
      addTodoItem(
        key,
        todoData,
        listTodo,
        formTodo.input.value,
        formTodo.textArea.value
      );
      formTodo.form.reset();
    } else {
      if (!formTodo.input.value) {
        formTodo.input.classList.add("is-invalid");
      }
      if (!formTodo.textArea.value) {
        formTodo.textArea.classList.add("is-invalid");
      }
    }
  });

  listTodo.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("list-item")) {
      const item = todoData.find((elem) => elem.id === target.id);
      modal.showModal(item.nameTodo, item.descriptionTodo, item.id);
    }
  });

  modal.btnReady.addEventListener("click", () => {
    const itemTodo = todoData.find(
      (elem) => elem.id === modal.modalWindow.dataset.idItem
    );
    console.log(itemTodo);
    itemTodo.success = !itemTodo.success;
    updateTodo(listTodo, todoData, key);
  });
  modal.btnDelete.addEventListener("click", () => {
    const index = todoData.findIndex(
      (elem) => elem.id === modal.modalWindow.dataset.idItem
    );
    todoData.splice(index, 1);
    updateTodo(listTodo, todoData, key);
  });

  document.title = key;

  updateTodo(listTodo, todoData, key);
};

initTodo(".app", "Список дел");
