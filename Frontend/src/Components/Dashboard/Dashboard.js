import React, { useEffect, useState } from 'react'
import classes from "./dashboard.module.css"
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [admin, setAdmin] = useState();
  

  useEffect(() => {
    const isadmin = localStorage.getItem('user');
    if(isadmin){
      const parsedAdmin = JSON.parse(isadmin)
      setAdmin(parsedAdmin.admin)
    }
    },[])
  return (
    <div className={classes.container}>
       <div className={classes.menu}>
          {
          allItems.filter(item => admin || !item.forAdmin)
          .map(item => 
          <Link 
          key={item.title}
          to={item.url} 
          style={{
            backgroundColor: item.bgColour, 
            color: item.color}}>
               <img src={item.imageUrl} alt={item.title} />
               <h2>{item.title}</h2>
          </Link>)
          }
       </div>
    </div>
  )
}

export default Dashboard

const allItems =[
    {
        title: 'Orders',
        imageUrl: '/icons/orders.svg',
        url: '/orders',
        bgColour: '#ec407a',
        color: 'white',
    },
    {
        title: 'Users',
        imageUrl: '/icons/users.svg',
        url: '/admin/users',
        forAdmin: true,
        bgColour: '#00bfa5',
        color: 'white',
    },
    {
        title: 'Foods',
        imageUrl: '/icons/foods.svg',
        url: '/admin/foods',
        forAdmin: true,
        bgColour: '#e040fb',
        color: 'white',
    },
]
