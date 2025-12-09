import React, { useEffect, useState } from 'react';
import '../../assets/css/loginStyle.css';
import axiosInstance from '../../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../redux/slices/userSlice';
import Notification from '../../components/toastNotification';
import { Link, useNavigate  } from 'react-router-dom';
import { decodeJWT } from '../../utils/jwtUtil';

function Login() {
  const [employeeID, setEmployeeID] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(()=> {
   dispatch(logout());
  },[]);


  const handleSubmit = async (event) => {
   // event.preventDefault();

    try {
      // Send login request
      const response = await axiosInstance.post('/auth/login', {
        username: employeeID,
        password: password
      });
      console.log(response.data)
      
      const {  username, role, fullnames, grade, department } = decodeJWT(response.data.jwtToken);
      const departmentObject = JSON.stringify(department);
      
      dispatch(login({ jwtToken: response.data.jwtToken, username, role, fullnames, grade, department: departmentObject }));
      setNotification({message: 'Login Successful', type:'success'})
      navigate('/')
      
    } catch (error) {
    console.log(error)
      setNotification({message: 'Login Failed. Check Username or Password', type: 'error'})
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="centered-form">
       <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <div className="card">
        <div className="image_container mb-4">
          <img src="Assets/RRA_Logo_home.png" alt="Placeholder Image" className="img-fluid" style={{ maxHeight: '110px', objectFit: 'contain' }} />
        </div>
        <h3 className="text-blue-700 text-xl text-center font-serif mb-3">
          New Operating Model Portal
        </h3>
        <p className="font-serif font-bold text-xl mb-4 login_label">
          Login
        </p>

        <form>
          <div className="input-icon">
            <div className="form-group mb-3">
              <i className="fas fa-user"></i>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Employee ID"
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-icon">
            <div className="form-group mb-3">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="inputPassword5"
                className="form-control"
                aria-describedby="passwordHelpBlock"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-flex-align mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember Me
              </label>
            </div>
            <Link className="forget" to="/forgot-password">Forgot Password</Link>
          </div>

         
        </form>
        <button type="button" className="btn btn-primary btn-signin" onClick={handleSubmit}>
            Sign In
          </button>
      </div>
    </div>
  );
}

export default Login;