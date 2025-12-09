import React, { useState } from 'react';
import '../../assets/css/New.css';
import Notification from '../../components/toastNotification';
import axiosInstance from '../../utils/axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SetNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setShowIcon(value.length > 0);

    // Save password to local storage
    localStorage.setItem('newPassword', value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Save confirmPassword to local storage
    localStorage.setItem('confirmPassword', value);
  };

  const handleResetPassword = async () => {
    if (password.length < 8) {
      setNotification({ message: 'Password should be at least 8 characters', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (!password) {
      setNotification({ message: 'Password is required!', type: 'error' });
      return;
    }
    if (!confirmPassword) {
      setNotification({ message: 'Confirm password is required!', type: 'error' });
      return;
    }

    try {// Get the email from localStorage
      const resetCode = localStorage.getItem('resetCode'); // Get the reset code from localStorage

      // Send the new password, code, and email to the backend
      await axiosInstance.post('/password/reset-password', {
        token,
        code: resetCode,
        newPassword: password,
        confirmPassword,
      });

      setNotification({ message: 'Password reset successfully', type: 'success' });
    
      localStorage.removeItem('resetCode');
      navigate('/login')
    } catch (error) {
      console.log(error.response);
      setNotification({ message: 'Failed to reset password', type: 'error' });
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };;

  return (
    <div className="set-new-password-container">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <div className="icon-container">
        <span className="lock-icon">🔒</span>
      </div>
      <h1>Set new password</h1>
      <p className="password-requirement">Must be at least 8 characters.</p>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter Password"
        />
          {showIcon && (
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '10px',
            top: '35px', // Adjust based on your input styling
            cursor: 'pointer',
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      </div>

      <div className="input-group">
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Re-enter Password"
        />
      </div>

      <button className="reset-button" onClick={handleResetPassword}>
        Reset password
      </button>

      <a href="/login" className="back-link">← Back to log in</a>
    </div>
  );
};

export default SetNewPassword;