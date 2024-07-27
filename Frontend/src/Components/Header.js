import React from 'react'
import classes from "./Header.module.css"
import { Link } from 'react-router-dom'
import Logo from "../Assets/Logo.png"
import { useCart } from '../hooks/UseCart'
import { useAuth } from '../hooks/UseAuth'

const Header = () => {

    const { cart } = useCart()

    const { user, logout } = useAuth()

    const cartitem = {
        totalCount: cart.totalCount,
    }

  return (
    <header className={classes.header}>
        <div className={classes.container}>
            <Link to='/' className={classes.logo}>
               <img src={Logo} alt='logo' width={100} height={100} />
            </Link>
            <nav>
                <ul>
                    {
                user ?
                 ( <li className={classes.menu_container}>
                    <Link to="/dashboard" className={classes.profile}>{user}</Link>
                    <div className={classes.menu}>
                        <Link to='/orders'>Order</Link>
                        <a href='#' onClick={logout}>Logout</a>
                    </div> 
                    </li> ):
                    (
                        <Link to='/login'>Login</Link>
                    )}
                    <li>
                        <Link to='/cart' className={classes.cart}>
                            Cart  {cartitem.totalCount > 0 && <span className={classes.cart_count}>{cartitem.totalCount}</span>}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  )
}

export default Header
