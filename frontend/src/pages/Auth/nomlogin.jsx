import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../utils/jwtUtil';
import { login } from '../../redux/slices/userSlice';


function NomLogin() {
  const location = useLocation();
  const dispatch=useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    const nomacesstoken = queryParams.get('nomacesstoken');
  
    if(nomacesstoken){
      const { username, role, fullnames, grade, department } = decodeJWT(nomacesstoken);
      const departmentObject = JSON.stringify(department);
      dispatch(login({ jwtToken: nomacesstoken, username, role, fullnames, grade, department: departmentObject }));
      navigate('/')
      
    }else{
      window.location.href="https://nom.rra.gov.rw/"
    }
  },[])


  return (
    <div>Please wait</div>
  )
}

export default NomLogin