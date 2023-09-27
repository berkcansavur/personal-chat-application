import './SignUp.css';
import {useState} from "react"
import axios from 'axios';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Contexts/auth.context';
function Login() {
  const [ email, setEmail] = useState('')
  const [ password, setPassword] = useState('')
  const navigate = useNavigate();
  const { login }  = useAuth();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    await axios.post('http://localhost:3001/app/login',{
      email: email,
      password: password
    },{ withCredentials: true })
    .then((res)=>{
      sessionStorage.setItem("token", res.data.access_token);
      login();
    })
    .catch((err)=>{
      console.log(err);
    });
    
    navigate('/profile')
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
