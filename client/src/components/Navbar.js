import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const token = sessionStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(!!token);
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  const getAccessToken = async () => {
    await axios.get(`http://localhost:3001/app/getAuthToken`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res)=>{
      sessionStorage.setItem("token",res.data.access_token);
      if(res.data.access_token==null){
        setLoggedIn(false);
      }
      setLoggedIn(true);
    }).catch((err)=>{
      console.log(err);
    console.log('Access Token could not retrieved.')
    });
}
  useEffect(() => {
    showButton();
  }, []);
  useEffect(()=> {
    
    getAccessToken();
  },[token]);
  window.addEventListener('resize', showButton);
  window.addEventListener('scroll', getAccessToken);
  
  const handleLogout = async() => {

      await axios.get("http://localhost:3001/app/logout",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res)=>{
        sessionStorage.setItem("token",res.data.access_token);
        setLoggedIn(false);
      }).catch((err) => {
        console.error(err);
        console.error('Token was not deleted');
      });
  };
  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            JumpIn
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/chats'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Create Chat Group
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/network'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Network
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/profile'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>
          </ul>
          {button && !loggedIn ? ( 
          <Button toOperation='login' buttonStyle='btn--outline'>Log In</Button>) : 
          (<Button toOperation='logout' onClick={handleLogout} buttonStyle='btn--outline'>Log Out</Button>)}
        </div>
      </nav>
    </>
  );
}

export default Navbar;