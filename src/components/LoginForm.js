import React, { useState, useRef, useEffect } from 'react';
import '../static/login.css'; // Ensure to link your CSS
import { login, register, passwordReset } from '../services/api';
import Loader from './Loader';

const LoginFormDialog = ({ onLogin }) => {
  const dialogRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedForm, setSelectedForm] = useState('login');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Memoized openDialog function
  // const openDialog = useCallback(() => {
  //   alert('Modal opened');
  //   const dialog = dialogRef.current;
  //   if (dialog && !modalOpen) {
  //     dialog.showModal();
  //     setModalOpen(true);
  //     document.body.classList.add('add_blur');
  //   }
  // }, [modalOpen]);

  const openDialog = () => {
    if (!modalOpen) {
       // Check if the dialog is not already open
      const dialog = dialogRef.current;

      dialog.showModal();
      setModalOpen(true);
      document.body.classList.add('add_blur');
    }
  };

  // Memoized closeDialog function
  // const closeDialog = useCallback(() => {
  //   const dialog = dialogRef.current;
  //   if (dialog && dialog.open) {
  //     dialogRef.current.close();
  //     alert('Modal closed');
  //     setModalOpen(false);
  //     document.body.classList.remove('add_blur');
  //   }
  // }, []);

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog.open) {  // Check if the dialog is open
      dialog.close();
      setModalOpen(false);
      document.body.classList.remove('add_blur');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedForm === 'login') {
      setLoading(true);
      setMessage('');

      const success = await login(username, password);
      setLoading(false);
      if (success) {
        onLogin(username);
        closeDialog();
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } else if (selectedForm === 'register') {
      setLoading(true);
      setMessage('');

      const success = await register(newUsername, newEmail, newPassword);
      setLoading(false);
      if (success) {
        onLogin(newUsername);
        setMessage('Registration successful!');
        closeDialog();
      } else {
        setMessage('Failed! Make sure your email is not registered.');
      }
    } else if (selectedForm === 'password-reset') {
      setMessage('');

      const success = await passwordReset(newEmail);
      if (success) {
        setMessage('Password reset email sent!');
      } else {
        setMessage('Failed! Make sure your email is already registered.');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      openDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMessage('');
  }, [selectedForm]);

  return (
    <>
      <div className='login-register-container'>
        <button onClick={openDialog} className="login-button">Login | Register</button>
      </div>
      <dialog ref={dialogRef} className="login-dialog login-modal">
        {loading && <Loader />}
        <div>
          {selectedForm === 'login' &&
            <form method="dialog" onSubmit={handleSubmit} className="login-form">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Login</h2>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className='text-input'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  className='text-input'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Login</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('register')}>Register</button>
                <button onClick={() => setSelectedForm('password-reset')}>Forgot Password?</button>
              </div>
            </form>
          }

          {selectedForm === 'register' &&
            <form method="dialog" onSubmit={handleSubmit} className="login-form" autoComplete="off">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Register</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className='text-input'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-username">Username</label>
                <input
                  type="text"
                  id="new-username"
                  className='text-input'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Password</label>
                <input
                  type="password"
                  id="new-password"
                  className='text-input'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Register</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('login')}>Login</button>
              </div>
            </form>
          }

          {selectedForm === 'password-reset' &&
            <form method="dialog" onSubmit={handleSubmit} className="password-reset-form">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Reset Password</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className='text-input'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Send Email</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('login')}>Back to Login &#8592;</button>
              </div>
            </form>
          }

          <br />
          {message && <p>{message}</p>}
        </div>
      </dialog>
    </>
  );
};

export default LoginFormDialog;
