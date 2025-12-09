import React, { useState, useRef } from 'react';
import '../../assets/css/reset.css';
import SetNewPassword from './New';
import Notification from '../../components/toastNotification';
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

const PasswordReset = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const inputRefs = useRef([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Extract email and token from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleCodeChange = (index, value) => {
    const numericValue = value.replace(/\D/, '');
    const newCode = [...code];
    newCode[index] = numericValue;
    setCode(newCode);

    if (numericValue && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (!numericValue && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Save code to local storage
    localStorage.setItem('resetCode', Number(newCode.join('')));
  };

  const handleContinue = () => {
    const enteredCode = code.join('');

    if (enteredCode.length === 4) {
      setIsCodeValid(true);
    } else {
      setNotification({ message: 'Incomplete code', type: 'error' });
    }
  };


  const handleResend = async () => {
    setNotification({ message: 'Resending code to email', type: 'info' });

    try {
      await axiosInstance.post(`/password/resend-code?email=${email}`);
      setNotification({ message: 'Code resent successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to resend code', type: 'error' });
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="password-reset-container">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      {!isCodeValid ? (
        <>
          <div className="icon-container">
            <i className="envelope-icon">✉️</i>
          </div>
          <h1>Password reset</h1>
          <p>Enter the code sent to {email}</p>
          <div className="code-input-container">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="code-input"
              />
            ))}
          </div>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
          <p className="resend-text">
            Didn't receive the email? <span onClick={handleResend}>Click to resend</span>
          </p>
          <Link to="/login" className="back-link">← Back to log in</Link>
        </>
      ) : (
        <SetNewPassword token={token} code={code.join('')} /> // Pass token and code to SetNewPassword
      )}
    </div>
  );
};

export default PasswordReset;