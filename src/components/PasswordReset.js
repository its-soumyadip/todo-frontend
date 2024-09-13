// PasswordReset.js

import { useParams } from 'react-router-dom';  // To access route parameters
import { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
  // Access the uidb64 and token from the URL
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      // Send request to your backend API to reset the password
      const response = await axios.post('https://your-backend-api.com/api/password-reset-confirm/', {
        uidb64,
        token,
        new_password: newPassword
      });
      console.log(response)

      setMessage('Password has been reset successfully!');
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.detail);
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      {message && <p>{message}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
    </div>
  );
};

export default PasswordReset;
