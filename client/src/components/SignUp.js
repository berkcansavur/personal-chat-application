import './SignUp.css';
import {useState} from "react"
import axios from '../api/axios'
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
function SignUp() {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [ password, setPassword] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e)=>{
    e.preventDefault();
    console.log(name,email,password);
    axios.post('http://localhost:3001/users/signup',{
      name: name,
      email: email,
      password: password
    })
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    });
    navigate('/')
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
