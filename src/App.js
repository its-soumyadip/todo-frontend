import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import PasswordReset from './components/PasswordReset';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import './static/main.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [message, setMessage] = useState('Please login to add and view your tasks!');
  const [loading, setLoading] = useState(true); // Introduce a loading state

  const navigate = useNavigate();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setMessage('');
    }
    setLoading(false); // Set loading to false once token check is done
  }, []);

  const handleTasksUpdated = () => {
    setTasksUpdated(prevState => !prevState); // Toggle state to trigger re-fetch
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('username'); // Remove username
    setIsLoggedIn(false); // Update state to reflect logout
    setMessage("You have been logged out. Please login to add and view your tasks!")
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    handleTasksUpdated();
    setUsername(username);
    localStorage.setItem('username', username); // Store username in localStorage
    setMessage(`Welcome back, ${username}!`);
    navigate('/');
  };

  // If loading, display a loading message or null
  if (loading) {
    return <div>Loading...</div>; // You can customize this with a spinner or similar UI
  }

  return (
    <div className="App">
      <div className="todo-app">
        {/* Show logout button only when the user is logged in */}
        {isLoggedIn && (
          <>
          <button className="logout-button" onClick={handleLogout}>
            Logout <i class="fa-solid fa-right-from-bracket"></i>
          </button>

        <i className="fa-solid fa-right-from-bracket logout-backup" onClick={handleLogout}></i>
        </>
        )}

        <Routes>
          {/* Home route to display the task management UI */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <h1 id="h1">What's your plan today {username}?</h1>
                  <TaskForm onTaskAdded={handleTasksUpdated} />
                  {message && <p className="message">{message}</p>}
                  <TaskList tasksUpdated={tasksUpdated} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login page route */}
          <Route
            path="/login"
            element={
              <>
              <br></br>
              <br></br>
              {message && <p className="message">{message}</p>}
            <LoginForm onLogin={handleLogin} />
            </>
          }
          />

          {/* Password reset request route */}
          <Route path="/reset-password" element={<PasswordReset />} />

          {/* Password reset confirm route with parameters (uidb64 and token) */}
          <Route
            path="/reset-password/:uidb64/:token"
            element={<PasswordResetConfirm />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default AppWrapper;
