import React, { useState, useEffect } from "react";
import favicon from "/favicon.ico";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "./components/modals/Modals.jsx";
import "bootstrap/dist/js/bootstrap.min.js";
import { Icons } from "./assets/Icons.jsx";

export default function App() {
  const [taskName, setTaskName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("taskNames")) || [];

    // Separate tasks based on their done status
    const filteredTodoTasks = storedTasks.filter((task) => !task.done);
    const filteredDoneTasks = storedTasks.filter((task) => task.done);

    // Update states with filtered tasks
    setTodoTasks(filteredTodoTasks);
    setDoneTasks(filteredDoneTasks);
  }, [localStorage.getItem("taskNames")]);

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  // Handle Status

  // Toggle task status between "Current" and "Done"
  const handleToggleStatus = (taskId) => {
    const storedTasks = JSON.parse(localStorage.getItem("taskNames")) || [];
    const taskToUpdate = storedTasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    taskToUpdate.done = !taskToUpdate.done;

    // Update local storage
    localStorage.setItem("taskNames", JSON.stringify(storedTasks));

    // Update state based on task's done status
    if (taskToUpdate.done) {
      // Move task to "Done" column
      setDoneTasks((prevDoneTasks) => [...prevDoneTasks, taskToUpdate]);
      setTodoTasks((prevTodoTasks) =>
        prevTodoTasks.filter((task) => task.id !== taskId)
      );
    } else {
      // Move task back to "Current" column
      setTodoTasks((prevTodoTasks) => [...prevTodoTasks, taskToUpdate]);
      setDoneTasks((prevDoneTasks) =>
        prevDoneTasks.filter((task) => task.id !== taskId)
      );
    }
  };

  // Update label class based on task's done status
  const renderLabelClass = (task) => {
    return task.done ? "form-check-label done-task" : "form-check-label";
  };

  //Local Storage
  const handleSubmit = () => {
    if (taskName.trim() !== "") {
      const taskId = new Date().getTime(); // Generate a unique timestamp-based ID
      const updatedTask = { id: taskId, name: taskName, done: false };

      // Add the new task to the appropriate array based on its done status
      const updatedTodoTasks = [...todoTasks, updatedTask];
      const updatedDoneTasks = [...doneTasks];

      localStorage.setItem(
        "taskNames",
        JSON.stringify([...updatedTodoTasks, ...updatedDoneTasks])
      );
      setTaskName("");
      setModalOpen(false);
      setTodoTasks(updatedTodoTasks);
      closeModal();
    } else {
      alert("Task name cannot be empty.");
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    document.getElementById("closeAdd").click();
  };

  //Update Task
  const handleUpdate = (index, newName) => {
    const updatedTodoTasks = [...todoTasks];
    updatedTodoTasks[index].name = newName;

    // Update task names in local storage
    localStorage.setItem(
      "taskNames",
      JSON.stringify([...updatedTodoTasks, ...doneTasks])
    );

    setTodoTasks(updatedTodoTasks);
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
        onClick={handleUpdate}
      >
        <input
          type="text"
          value={taskName}
          onChange={handleUpdate}
          className="form-control"
        />
      </Modal>
      {/* Delete Task Modal */}
      <Modal
        id="deleteModal"
        title="Delete Task"
        color="danger"
        buttonName="Delete"
        onClick={() => {
          alert("Deleted");
        }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      {/* Delete All Task Modal */}
      <Modal
        id="deleteAllModal"
        title="Delete All Task"
        color="danger"
        buttonName="Delete"
        onClick={() => {
          alert("Deleted");
        }}
      >
        <p>Are you sure you want to delete all?</p>
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
                        id="task2Checkbox"
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="task2Checkbox"
                      >
                        Done All
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn ms-2"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteAllModal"
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
                          id={`task${task.id || index}Checkbox`} // Use task.id if available, otherwise fallback to index
                          checked={task.done}
                          onChange={() => handleToggleStatus(task.id)}
                        />
                        <label
                          className={renderLabelClass(task)}
                          htmlFor={`task${task.id || index}Checkbox`} // Use task.id if available, otherwise fallback to index
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

          {/* Done */}
          <div className="col">
            <div className="card mb-3 lexmeet-border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Title */}
                  <h4>Done</h4>
                  <div className="d-flex align-items-center m-0">
                    <button
                      type="button"
                      className="btn ms-2"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteAllModal"
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
                          data-bs-target="#updateModal"
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
