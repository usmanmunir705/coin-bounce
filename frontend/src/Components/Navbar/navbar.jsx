import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from "./navbar.module.css"
import { useSelector } from 'react-redux'
import { signout } from '../../api/internal'
import {resetUser} from '../../store/userSlice'
import { useDispatch } from 'react-redux'

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated=useSelector((state)=>state.user.auth)

    const handleSignout = async ()=>{
      await signout();
      dispatch(resetUser());
    }
  return (
    <>
        <nav className={styles.navbar}>

          <NavLink to='/' className={`${styles.logo} ${styles.inActiveStyle}`}> CoinBounce</NavLink>

          <NavLink 
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle} 
          to='/'>
          Home
          </NavLink>

          <NavLink 
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle}
           to='crypto'>
           Cryptcurrencies
           </NavLink>

          <NavLink 
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle}
          to='blogs'>
          Blogs
          </NavLink>

          <NavLink 
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle}
          to='submit'>
          Submit a Blog
          </NavLink>

          { isAuthenticated?
          <div><NavLink><button className={styles.logoutButton} onClick={handleSignout}>signout</button></NavLink></div>:
          <div>
          <NavLink
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle}
           to='login'>
           <button className={styles.loginButton}>Log In</button>
           </NavLink>

          <NavLink
          className={({isActive})=>isActive? styles.activeStyle:styles.inActiveStyle}
           to='signup'>
           <button className={styles.signupButton}>Sign Up</button>
           </NavLink>
          </div>
          }
        </nav>
        <div className={styles.separator}></div>
    </>
  )
}

export default Navbar