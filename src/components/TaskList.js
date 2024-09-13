import React, { useEffect, useState } from "react";
import { getTasks, updateTask, deleteTask } from "../services/api";

function TaskList({ tasksUpdated }) {
  const [tasks, setTasks] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [tasksUpdated]); // Re-fetch tasks whenever tasksUpdated changes

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateTask(id, { title: editTitle });
      setEditId(null);
      setEditTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="nes">
      {tasks.map((task) => (
        <div className="todo-row" key={task.id}>
         {editId === task.id ? (
            <div className="notes">
              <input
              className="todo-edit-input"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

               <i  onClick={() => handleUpdate(task.id)} class="fa-solid fa-circle-check fa-lg"></i>

           
              <i class="fa-solid fa-xmark fa-lg" onClick={() => setEditId(null)}></i>
            </div>
          ) : (
            <div className="todo-row-2">
              <div className="notes">{task.title}</div>
              <div className="icons">
                <i
                  className="fas fa-edit edit-icon"
                  onClick={() => {
                    setEditId(task.id);
                    setEditTitle(task.title);
                  }}
                ></i>
                <i
                  className="fas fa-trash delete-icon"
                  onClick={() => handleDelete(task.id)}
                ></i>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
