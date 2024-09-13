import React, { useState } from 'react';
import { createTask } from '../services/api';

const TaskForm = ({ onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({ title: taskTitle });
      setTaskTitle('');
      onTaskAdded(); // Notify the parent that a task has been added
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="New task"
        className='todo-input'
        required
      />
      <button className='todo-button' type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
