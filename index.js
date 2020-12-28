const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} nombre the title of the Task
 * @param {string} apellido the title of the Task
 * @param {string} email
 * @param {string} whatsapp
 * @param {string} pais the description of the Task
 */
const saveTask = (nombre,apellido,email,whatsapp,pais) =>
  db.collection("suscriptor").doc().set({
    nombre,
    apellido,
    email,
    whatsapp,
    pais,
  });

const getTasks = () => db.collection("suscriptor").get();

const onGetTasks = (callback) => db.collection("suscriptor").onSnapshot(callback);

const deleteTask = (id) => db.collection("suscriptor").doc(id).delete();

const getTask = (id) => db.collection("suscriptor").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('suscriptor').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${task.nombre}</h3>
    <p>${task.apellido}</p>
    <p>${task.email}</p>
    <p>${task.whatsapp}</p>
    <p>${task.pais}</p>
    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const susp = doc.data();
          taskForm["nombre"].value = susp.nombre;
          taskForm["apellido"].value = susp.apellido;
          taskForm["email"].value = susp.email;
          taskForm["whatsapp"].value = susp.whatsapp;
          taskForm["pais"].value = susp.pais;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = taskForm["nombre"];
  const apellido = taskForm["apellido"];
  const email = taskForm["email"];
  const whatsapp = taskForm["task-whatsapp"];
  const pais = taskForm["pais"];

  try {
    if (!editStatus) {
      await saveTask(nombre.value, apellido.value,email.value, whatsapp.value, pais.value);
    } else {
      await updateTask(id, {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        whatsapp: whatsapp.value,
        pais: pais.value,
      })

      editStatus = false;
      id = '';
      taskForm['enviar'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});