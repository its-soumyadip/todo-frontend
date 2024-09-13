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


  const openDialog = () => {
    if (!modalOpen) {
       // Check if the dialog is not already open

      dialogRef.current.showModal();
      setModalOpen(true);
      document.body.classList.add('add_blur');
    }
  };
  
  const closeDialog = () => {
    if (dialogRef.current.open) {  // Check if the dialog is open
      dialogRef.current.close();
      setModalOpen(false);
      document.body.classList.remove('add_blur');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if login form is selected 

    if (selectedForm === 'login') {
      setLoading(true);
      setMessage('')
    
    const success = await login(username, password);
    if (success) {
      setLoading(false);
      onLogin(username);  // Trigger the onLogin function passed from the parent
      closeDialog();
    } else {
      setLoading(false);
      setMessage('Login failed. Please check your credentials.');

      // if register form is selected 

    }} else if (selectedForm === 'register') {
      setLoading(true);
      setMessage('')
      const success = await register(newUsername, newEmail, newPassword);
      if (success) {
        setLoading(false);
        onLogin(newUsername);  // Trigger the onLogin function passed from the parent
        setMessage('Registration successful!'); 
        closeDialog();
      } else {
        setLoading(false);
        setMessage('Failed! Make sure your email is not registered.');
      }

      // if password reset form is selected

    } else{
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
      openDialog(); // Open the dialog automatically if not logged in
    }
  }, []);

    // Watch for changes in `selectForm` and clear the message
    useEffect(() => {
      setMessage(''); // Clear message whenever selectForm changes
    }, [selectedForm]); // Depend on selectForm

  return (
    <>
    <div className='login-register-container'>
      <button onClick={openDialog} className="login-button">Login | Register</button>
      </div>
      <dialog ref={dialogRef} className="login-dialog login-modal">
        { loading && <Loader/>}

   
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
 <form method="dialog" onSubmit={handleSubmit} className="login-form" autocomplete="off">
 <span className="close-icon" onClick={closeDialog}>&times;</span>
 <h2>Register</h2>
 <div className="form-group">
   <label htmlFor="email">Email</label>
   <input
     type="email"
     id="email"
     className='text-input'
     onChange={(e) => setNewEmail(e.target.value)}
     autocomplete="off"
     required
   />
 </div>
 <div className="form-group">
   <label htmlFor="username">Username</label>
   <input
     type="text"
     id="password"
     onChange={(e) => setNewUsername(e.target.value)}
    autocomplete="off"
     className='text-input'
     required
   />
 </div>
 <div className="form-group">
   <label htmlFor="password">Password</label>
   <input
     type="password"
     id="password"
     className='text-input'
     onChange={(e) => setNewPassword(e.target.value)}
    autocomplete="off"
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
  <form method="dialog" onSubmit={handleSubmit} className="pasword-reset-form">
 <span className="close-icon" onClick={closeDialog}>&times;</span>
 <h2>Reset Password</h2>
 <div className="form-group">
   <label htmlFor="email">Email</label>
   <input
     type="email"
     id="email"
     className='text-input'
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
<br></br>
{message && <p>{message}</p>}
</div>
      
      </dialog>
    </>
  );
};

export default LoginFormDialog;
