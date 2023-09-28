import './SignUp.css';
import {useState} from "react"
import axios from '../api/axios'
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupUser } from '../features/user/userSlice';
function SignUp() {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [ password, setPassword] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const payload = { 
        name:name,
        email:email,
        password:password
      }
      dispatch(signupUser(payload)).then((result)=>{
        if(result.payload){
          setUsername('')
          setEmail('');
          setPassword('');
          navigate('/')
        }
      })
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    
    <div className='sign-up'>
      <div className='sign-up__container'>
        <div className='sign-up__wrapper'>
        <form onSubmit={handleSubmit}>
        <p>Username</p>
        <input 
        className='signup-input'
        required
        type = "text"
        value = {name}
        onChange = {(e)=>{
          setUsername(e.target.value);
        }}
        />
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
        <Button type= 'submit' buttonStyle='btn--outline'>Sign Up</Button>
      </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
