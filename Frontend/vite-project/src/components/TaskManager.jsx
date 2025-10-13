import { useEffect, useState } from "react";
import axios from "axios";
import { FiLogOut } from "react-icons/fi"; // or import { LogOut } from "lucide-react"
import Swal from "sweetalert2";
import "./TaskManager.css";

function TaskManager({ onLogout }) {
  const API_URL = "http://localhost:5000";

  // ✅ axios instance with token
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axiosInstance.get("/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.log("error fetching tasks", error);
      }
    }
    fetchTasks();
  }, []);

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // track which task is being edited
  const [filter, setFilter] = useState("all");

  //---------counter------------------//
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(function (task) {
    return task.completed === false;
  }).length;

  const completedTasks = tasks.filter(function (task) {
    return task.completed === true;
  }).length;

  //===============================functions============================//

  async function addTask() {
    if (task.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Empty Task",
        text: "Task cannot be empty!",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (editIndex !== null) {
        // ✅ Update existing task
        const taskToUpdate = tasks[editIndex];
        const response = await axiosInstance.put(
          `/api/tasks/${taskToUpdate.id}`,
          {
            task: task,
            completed: taskToUpdate.completed,
          }
        );

        const copy = [...tasks];
        copy[editIndex] = response.data.task;
        setTasks(copy);
        setEditIndex(null);

        Swal.fire({
          icon: "success",
          title: "Task Updated!",
          showConfirmButton: false,
          timer: 1200,
        });
      } else {
        // ✅ Add new task
        const response = await axiosInstance.post("/api/tasks", {
          task: task,
          completed: false,
        });

        setTasks([response.data.task, ...tasks]);

        Swal.fire({
          icon: "success",
          title: "Task Added!",
          showConfirmButton: false,
          timer: 1200,
        });
      }

      setTask("");
    } catch (error) {
      console.log("Cannot add/edit task", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while saving your task.",
      });
    }
  }

  async function deleteTask(indexRemove) {
    const taskToDelete = tasks[indexRemove];

    // SweetAlert confirmation
    const confirmDelete = await Swal.fire({
      title: "Delete this task?",
      text: `"${taskToDelete.task}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/tasks/${taskToDelete.id}`);

      const updatedTask = [...tasks];
      updatedTask.splice(indexRemove, 1);
      setTasks(updatedTask);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Task has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("Error !! deleting task", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not delete task. Try again later.",
      });
    }
  }

  async function toggleTask(indexToggle) {
    const taskToToggle = tasks[indexToggle];

    try {
      const response = await axiosInstance.put(
        `/api/tasks/${taskToToggle.id}`,
        {
          completed: !taskToToggle.completed,
        }
      );

      const updatedTasks = [...tasks];
      updatedTasks[indexToggle] = response.data.task;
      setTasks(updatedTasks);
    } catch (error) {
      console.log("Error !! , task cannot be updated", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Task could not be updated. Please try again.",
        confirmButtonColor: "#6c63ff",
      });
    }
  }

  function editTask(indexEdit) {
    setTask(tasks[indexEdit].task);
    setEditIndex(indexEdit);
  }

  async function clearAllTasks() {
    Swal.fire({
      title: "Are you sure?",
      text: "All tasks will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#6c63ff",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete("/api/tasks");
          setTasks([]);
          Swal.fire({
            icon: "success",
            title: "Cleared!",
            text: "All tasks have been deleted.",
            confirmButtonColor: "#6c63ff",
          });
        } catch (error) {
          console.log("ERROR !! Couldn't clear tasks", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error clearing tasks. Try again later.",
            confirmButtonColor: "#6c63ff",
          });
        }
      }
    });
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="taskmanager-container">
      {/* Header */}
      <div className="taskmanager-header">
        <h1>TaskFlow Manager</h1>
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut className="logout-icon" />
        </button>{" "}
      </div>

      {/* Task Input */}
      <div className="taskmanager-input-section">
        <input
          type="text"
          placeholder="Enter the task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Stats */}
      <div className="taskmanager-stats">
        <h4>Total Tasks: {totalTasks}</h4>
        <h4>Pending Tasks: {pendingTasks}</h4>
        <h4>Tasks Completed: {completedTasks}</h4>
      </div>

      {/* Filter */}
      <div className="taskmanager-filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all" style={{ color: "black" }}>
            All
          </option>
          <option value="pending" style={{ color: "black" }}>
            Pending
          </option>
          <option value="completed" style={{ color: "black" }}>
            Completed
          </option>
        </select>
      </div>

      {/* Task List */}
      <ul className="taskmanager-list">
        {filteredTasks.map((taskItem, index) => (
          <li key={taskItem.id || index}>
            <div className="task-left">
              <input
                type="checkbox"
                checked={taskItem.completed}
                onChange={() => toggleTask(index)}
              />
              <span className={taskItem.completed ? "completed" : ""}>
                {taskItem.task}
              </span>
            </div>
            <div className="task-right">
              <button onClick={() => editTask(index)}>Edit</button>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="taskmanager-input-section">
        <button onClick={clearAllTasks} style={{ background: "red" }}>
          Clear all tasks
        </button>
      </div>

      {/* Bottom Actions
      <div className="task-actions">
        <button onClick={onLogout}>Logout</button>
      </div>
       */}
    </div>
  );
}

export default TaskManager;
