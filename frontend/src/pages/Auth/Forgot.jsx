import React, { useState } from 'react';
import '../../assets/css/forgot.css';
import Notification from '../../components/toastNotification.js';
import { Link, useNavigate  } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
     setNotification({message: 'Please enter a valid Email', type: 'error'});
      return;
    }

    try {
      const response = await axiosInstance.post(`/password/request-reset?email=${email}`);

      const { token } = response.data;
      
      setEmail('');
      setEmailError('');
      setNotification({message: 'Code sent to email', type: 'success'});
      navigate(`/reset-password?token=${token}&&email=${email}`)
      
    } catch (error) {
      setNotification({message:error.response.data.message, type: 'error'})
    }

  };
  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };


  return (
    <div className="forgot-password-container">
        <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <div className="forgot-password-card">
       
        <h2>Forgot password</h2>
        <p>No worries, we’ll send you reset instructions.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <button type="submit" className="reset">Reset password</button>
        </form>
        <Link to="/login" className="back-to-login">← Back to log in</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;