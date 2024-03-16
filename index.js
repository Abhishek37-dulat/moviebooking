// import axios from "axios";
const url = "https://crudcrud.com/api/95dfb3f31b594d9aa1244d6ba076aa40/data";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    e.preventDefault();
  } else {
    handleFormSubmit(e);
  }
  form.classList.add("was-validated");
});

async function handleFormSubmit(event) {
  const formDetails = {
    taskname: event.target.taskname.value,
    description: event.target.description.value,
    isDone: false,
  };
  const axData = await axios.post(url, formDetails);

  const todoExist = JSON.parse(localStorage.getItem("todoDetails")) || [];
  todoExist.push(axData.data);

  localStorage.setItem("todoDetails", JSON.stringify(todoExist));
  document.getElementById("taskname").value = "";
  document.getElementById("description").value = "";
  displayUsers();
}

async function displayUsers() {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";
  const getData = await axios.get(url);
  localStorage.setItem("todoDetails", JSON.stringify(getData.data));
  console.log(getData.data);
  const todoData = JSON.parse(localStorage.getItem("todoDetails"));
  const le = todoData.filter((item, i) => item.isDone == false);
  const emp = document.getElementById("emptybox");
  if (le.length > 0) {
    emp.style.display = "none";
    console.log(emp);
  } else {
    emp.style.display = "block";
  }
  for (let x = 0; x < todoData.length; x++) {
    if (todoData[x].isDone == false) {
      const listItem = document.createElement("div");
      listItem.className = "row row-cols-5 mt-3";
      const listData1 = document.createElement("div");
      listData1.className = "col-auto";
      listData1.textContent = `Task: ${todoData[x].taskname}`;
      const listData2 = document.createElement("div");
      listData2.className = "col-auto";
      listData2.textContent = `Description: ${todoData[x].description}`;

      const deleteButton = document.createElement("button");
      deleteButton.className = "col-auto m-2";
      deleteButton.textContent = "Delete";
      deleteButton.style.backgroundColor = "#0F0F0F";
      deleteButton.style.color = "#fff";
      deleteButton.style.border = "none";
      deleteButton.style.outline = "none";
      deleteButton.addEventListener("click", async () => {
        const data = todoData.filter((item, i) => i != x);
        const deleteData = await axios.delete(`${url}/${todoData[x]._id}`);
        localStorage.setItem("todoDetails", JSON.stringify(data));
        displayUsers();
      });

      const editButton = document.createElement("button");
      editButton.className = "col-auto m-2";
      editButton.textContent = "Done";
      editButton.style.backgroundColor = "#3484E3";
      editButton.style.color = "#fff";
      editButton.style.border = "none";
      editButton.style.outline = "none";

      editButton.addEventListener("click", async () => {
        todoData[x].isDone = !todoData[x].isDone;
        const data = todoData.map((item, index) => {
          console.log(x, index);
          if (index == x) {
            item.isDone = true;
          }
          return item;
        });
        const formDetails = {
          taskname: todoData[x].taskname,
          description: todoData[x].description,
          isDone: true,
        };
        const updateData = await axios.put(
          `${url}/${todoData[x]._id}`,
          formDetails
        );
        localStorage.setItem("todoDetails", JSON.stringify(data));
        displayUsers();
        displayUsers2();
      });

      listItem.appendChild(listData1);
      listItem.appendChild(listData2);
      listItem.appendChild(deleteButton);
      listItem.appendChild(editButton);
      userList.appendChild(listItem);
    }
  }
}

function displayUsers2() {
  const userList = document.getElementById("user-list-done");
  userList.innerHTML = "";
  const todoData = JSON.parse(localStorage.getItem("todoDetails"));
  for (let x = 0; x < todoData.length; x++) {
    if (todoData[x].isDone == true) {
      const listItem = document.createElement("div");
      listItem.className = "row row-cols-5 mt-3";
      const listData1 = document.createElement("div");
      listData1.className = "col-auto";
      listData1.textContent = `Task: ${todoData[x].taskname}`;
      const listData2 = document.createElement("div");
      listData2.className = "col-auto";
      listData2.textContent = `Description: ${todoData[x].description}`;

      listItem.appendChild(listData1);
      listItem.appendChild(listData2);
      userList.appendChild(listItem);
    }
  }
}

displayUsers();
displayUsers2();
