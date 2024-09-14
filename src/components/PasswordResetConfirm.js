import { useParams, useNavigate } from 'react-router-dom'; // To access route parameters
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import '../static/passwordreset.css'; // Ensure to link your CSS

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams(); // Get uidb64 and token from URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      document.body.classList.add('add_blur');
    }

    // Cleanup on component unmount or modal close
    return () => {
      if (dialog) {
        alert('Modal closed');
        dialog.close();
        document.body.classList.remove('add_blur');
      }
    };
  }, []); // This empty dependency array ensures it runs only once when the component loads

  const handlePasswordResetConfirm = async (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`https://iamsoumyadip.pythonanywhere.com/api/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setMessage('Password has been reset successfully!');
      console.log(response.data);
      // Optionally, redirect to login page
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('Error resetting password. Please try again.');
    }
  };

  const closeDialog = () => {
    alert('Modal closed');
    const dialog = dialogRef.current;
    alert(dialog);
    if (dialog) {
      alert('Modal closed');
      dialog.close();
      document.body.classList.remove('add_blur');
    }
    // Redirect to the home page
    navigate('/');
  };

  return (
    <div>
      <dialog ref={dialogRef} className="login-dialog login-modal">
        {message && <p>{message}</p>}
      
        <form onSubmit={handlePasswordResetConfirm} className="login-form">
          <span className="close-icon" onClick={closeDialog}>&times;</span>
          <h2>Reset Password</h2>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="text-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="text-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="dialog-buttons">
            <button type="submit" className="submit-button">Update password</button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default PasswordResetConfirm;
