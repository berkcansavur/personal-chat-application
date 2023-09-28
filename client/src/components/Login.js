import './SignUp.css';
import { Button } from './Button';
import { useState } from "react"
import  { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { getProfileData } from '../features/user/userSlice';

function Login() {  
  const [ email, setEmail] = useState('')
  const [ password, setPassword] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loggedIn} = useSelector((state)=> state.auth)
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const credentials = {
        email:email,
        password: password
      }
      dispatch(loginUser(credentials))
      .then((result)=>{
        if(result.payload.access_token){
          setEmail('');
          setPassword('');
          dispatch(getProfileData(result.payload.access_token))
          .then((result)=>{
            if(result.payload){
            navigate('/profile')
            }
          })
        }
      });
    }catch(error){
      console.error(error);
    }
    if(loggedIn === true){
      return <Navigate to="/profile" />;
    }
    
  }
  return (
    
    <div className='sign-up'>
      <div className='sign-up__container'>
        <div className='sign-up__wrapper'>
        <form onSubmit={handleSubmit}>
        <p>Email</p>
        <input 
        className='signup-input'
        required
        type = "email"
        value = {email}
        onChange = {(e)=>{
          setEmail(e.target.value);
        }}
        />
        <p>Password</p>
        <input 
        className='signup-input'
        required
        type = "password"
        value = {password}
        onChange = {(e)=>{
          setPassword(e.target.value);
        }}
        />
        <Button type= 'submit' buttonStyle='btn--outline'>Log In</Button>
      </form>
      <div className='sign-up__wrapper'>
        <p>Don't you have an account? Click to create one.</p>
        <Button toOperation='signup' buttonStyle='btn--outline'>Sign up</Button>
      </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
