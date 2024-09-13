import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await createTask({ title: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateTask(id, { title: editTitle });
      setEditId(null);
      setEditTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleCreate}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(task.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {task.title}
                <button onClick={() => { setEditId(task.id); setEditTitle(task.title); }}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
