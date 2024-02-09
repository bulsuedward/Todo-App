// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import favicon from "/favicon.ico";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "./components/modals/Modals.jsx";
import "bootstrap/dist/js/bootstrap.min.js";
import { Icons } from "./assets/Icons.jsx";

export default function App() {
  const [allTasks, setAllTasks] = useState([]); // All tasks
  const [todoTasks, setTodoTasks] = useState([]); // Current tasks
  const [doneTasks, setDoneTasks] = useState([]); // Done tasks
  const [modalOpen, setModalOpen] = useState(false);
  const [doneAllChecked, setDoneAllChecked] = useState(false);
  const [taskName, setTaskName] = useState(""); // Task name input value
  const [currentTaskId, setCurrentTaskId] = useState(""); // Task name to be updated

  // const [selectedTaskId, setSelectedTaskId] = useState(""); // Task name to be updated
  const [selectedTask, setSelectedTask] = useState(""); // Task name to be updated
  // Get the initial tasks from the local storage
  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setAllTasks(tasks);
  }, []);

  // Update the current and done tasks when allTasks state changes
  useEffect(() => {
    const currentTasks = allTasks.filter((task) => !task.done);
    const doneTasks = allTasks.filter((task) => task.done);
    setTodoTasks(currentTasks);
    setDoneTasks(doneTasks);
  }, [allTasks]);

  // Add new task
  const handleSubmit = () => {
    if (taskName) {
      const newTask = {
        id: Math.floor(Math.random() * 1000), // Generate a random id
        name: taskName,
        done: false,
      };
      const newTasks = [...allTasks, newTask];
      setAllTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setTaskName(""); // Clear the input field
      closeModal(); // Close the modal
    }
  };

  // Delete Task
  const handleDeleted = () => {
    const newTasks = allTasks.filter((task) => task.id !== currentTaskId);
    setAllTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    document.getElementById("closeDelete").click();
  };

  // Delete Done Task
  const handleDeletedDone = () => {
    const newTasks = allTasks.filter((task) => task.id !== currentTaskId);
    setAllTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    document.getElementById("closeDeleteDone").click();
  };

  // Update Task
  const handleUpdate = () => {
    const newTasks = allTasks.map((task) => {
      if (task.id === currentTaskId) {
        return { ...task, name: selectedTask };
      }
      return task;
    });
    setAllTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    document.getElementById("updated").click();
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    const newTasks = allTasks.map((task) => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      }
      return task;
    });
    setAllTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // Handle task status toggle
  const handleSelectedId = (id, name) => {
    setCurrentTaskId(id);
    setTaskName(name);
  };

  // Two way binding for task name input
  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    document.getElementById("closeAdd").click();
  };

  const handleDoneAllChange = () => {
    setDoneAllChecked(!doneAllChecked);
    if (!doneAllChecked) {
      const newTasks = todoTasks.map((task) => ({ ...task, done: true }));
      setAllTasks(newTasks.concat(doneTasks));
      localStorage.setItem("tasks", JSON.stringify(newTasks.concat(doneTasks)));
    } else {
      const newTasks = todoTasks.map((task) => ({ ...task, done: false }));
      setAllTasks(newTasks.concat(doneTasks));
      localStorage.setItem("tasks", JSON.stringify(newTasks.concat(doneTasks)));
    }
  };
  return (
    <div className="container">
      {/* Add new Task Modal */}
      <Modal
        id="createModal"
        title="Add New Task"
        color="success"
        buttonName="Save"
        onClick={handleSubmit}
        onHide={closeModal}
        show={modalOpen}
        closeBtn="closeAdd"
      >
        <input
          type="text"
          value={taskName} // Binding the input value to taskName state
          onChange={handleTaskNameChange} // Handling input change event
          className="form-control"
        />
      </Modal>
      {/* Update Task Modal */}
      <Modal
        id="updateModal"
        title="Edit Task"
        color="success"
        buttonName="Update"
        onClick={handleUpdate} // Pass taskId and taskName
        closeBtn="updated"
      >
        <input
          type="text"
          value={selectedTask} // Display current task name in the input field
          onChange={(e) => setSelectedTask(e.target.value)} // Update taskName state
          className="form-control"
        />
      </Modal>
      {/* Delete Current Task Modal */}
      <Modal
        id="deleteModal"
        title="Delete Task"
        color="danger"
        buttonName="Delete"
        onClick={handleDeleted}
        closeBtn="closeDelete"
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      {/* Delete Done Task Modal */}
      <Modal
        id="deleteModalDone"
        title="Delete Task"
        color="danger"
        buttonName="Delete"
        onClick={handleDeletedDone}
        closeBtn="closeDeleteDone"
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      {/* Delete All Current Modal */}
      <Modal
        id="deleteAllCurrentModal"
        title="Delete All Current Tasks"
        color="danger"
        buttonName="Delete"
        closeBtn="closeDeleteAllCurrent"
        onClick={() => {
          setAllTasks(doneTasks);
          localStorage.setItem("tasks", JSON.stringify(doneTasks));
          document.getElementById("closeDeleteAllCurrent").click();
        }}
      >
        <p>Are you sure you want to delete all current tasks?</p>
      </Modal>
      {/* Delete All Done Modal */}
      <Modal
        id="deleteAllDoneModal"
        title="Delete All Done Tasks"
        color="danger"
        buttonName="Delete"
        closeBtn="closeDeleteAllDone"
        onClick={() => {
          setAllTasks(todoTasks);
          localStorage.setItem("tasks", JSON.stringify(todoTasks));
          document.getElementById("closeDeleteAllDone").click();
        }}
      >
        <p>Are you sure you want to delete all done tasks?</p>
      </Modal>
      <div
        className="navbar d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "#F8FFFE" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={favicon}
              alt="Todo List"
              width="30"
              height="26"
              className="d-inline-block align-text-top"
            />
            <span
              className="ms-2"
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                lineHeight: "1.2",
                background: "-webkit-linear-gradient(#FF6E40, #673AB7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              To-do List
            </span>
          </a>
          {/* Add new Task Button */}
          <button
            className="btn btn"
            onClick={openModal}
            type="button"
            id="button-addon2"
            data-bs-toggle="modal"
            data-bs-target="#createModal"
            style={{
              transition: "transform 0.5s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "rotate(360deg)")}
            onMouseLeave={(e) => (e.target.style.transform = "rotate(0deg)")}
          >
            {/* <FaPlusCircle style={{ fontSize: "30px", color: "#FF4F6D" }} /> */}
            <img src={Icons.AddIcon} alt="Add Icon" width="30" height="30" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-3">
        <div className="row">
          {/* Current */}
          <div className="col">
            <div className="card mb-3 lexmeet-border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h4>Current</h4>
                  <div className="d-flex align-items-center m-0">
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input mb-1"
                        type="checkbox"
                        id="doneAllCheckbox"
                        checked={doneAllChecked}
                        onChange={handleDoneAllChange}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="doneAllCheckbox"
                      >
                        Done All
                      </label>
                    </div>
                    <button
                      id="deleteAllCurrentModal"
                      type="button"
                      className="btn btn"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteAllCurrentModal"
                    >
                      <img
                        src={Icons.DeleteAllIcon}
                        alt="Delete All Icon"
                        width="25"
                        height="25"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Current Tasks */}
            <div>
              {todoTasks.map((task, index) => (
                <div
                  className="card mb-3"
                  style={{
                    border: "2px solid #9D71BC",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  }}
                  key={task.id || index} // Use task.id if available, otherwise fallback to index
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`task${task.id || index}Checkbox`}
                          checked={task.done}
                          onChange={() => handleToggleStatus(task.id)}
                        />

                        <label
                          className={task}
                          htmlFor={`task${task.id || index}Checkbox`}
                        >
                          {task.name}
                        </label>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn"
                          data-bs-toggle="modal"
                          data-bs-target="#updateModal"
                          onClick={() => handleSelectedId(task.id, task.name)}
                        >
                          <img
                            src={Icons.ModifyIcon}
                            alt="Update Icon"
                            width="30"
                            height="30"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn btn"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          onClick={() => handleSelectedId(task.id, task.name)}
                        >
                          <img
                            src={Icons.DeleteIcon}
                            alt="Delete Icon"
                            width="30"
                            height="30"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done Task*/}
          <div className="col">
            <div className="card mb-3 lexmeet-border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Title */}
                  <h4>Done</h4>
                  <div className="d-flex align-items-center m-0">
                    <button
                      id="deleteAllDoneModal"
                      type="button"
                      className="btn btn"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteAllDoneModal"
                    >
                      <img
                        src={Icons.DeleteAllIcon}
                        alt="Delete All Icon"
                        width="25"
                        height="25"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Done Tasks */}
            <div>
              {doneTasks.map((task) => (
                <div
                  className="card mb-3"
                  style={{
                    border: "2px solid #9D71BC",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  }}
                  key={task.id}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`doneTask${task.id}Checkbox`}
                          checked={true} // Since it's in the "Done" column, all tasks are considered done
                          onChange={() => handleToggleStatus(task.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`doneTask${task.id}Checkbox`}
                        >
                          {task.name}
                        </label>
                      </div>

                      <div>
                        <button
                          type="button"
                          className="btn btn"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModalDone"
                          onClick={() => handleSelectedId(task.id, task.name)}
                        >
                          <img
                            src={Icons.DeleteIcon}
                            alt="Delete Icon"
                            width="30"
                            height="30"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
