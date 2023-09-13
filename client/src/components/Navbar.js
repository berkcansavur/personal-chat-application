import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';
import { useAuth } from './Contexts/auth.context';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { loggedIn, logout } = useAuth();
  const token = sessionStorage.getItem("token");
  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3001/app/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      sessionStorage.setItem("token", response.data.access_token);
      logout();
    } catch (err) {
      console.error(err);
      console.error('Token was not deleted');
    }
  };
  
  const getAndSetAccessToken = async () => {
    try {
      const response = await axios.get("http://localhost:3001/app/getAuthenticatedUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      sessionStorage.setItem("token", response.data.access_token);
    } catch (err) {
      console.error('Token was not retrieved.');
    }
  };
  useEffect(()=>{
    getAndSetAccessToken();
  },[token]);
  

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            JumpIn
            <i className='fab fa-typo3' />
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
          {button ? (
            loggedIn ? 
            (
              <Button toOperation='logout' onClick={handleLogout} buttonStyle='btn--outline'>Log Out</Button>
            ) : 
            (
              <Button toOperation='login' buttonStyle='btn--outline'>Log In</Button>
            )
          ) : null}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
