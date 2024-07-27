import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import classes from "./UsersPage.module.css"
import { getAll, toggleBlock } from '../../Services/UserService';
import Title from '../../Components/Title/Title';
import Search from '../../Components/Search/Search';

const UsersPage = () => {
    const [users, setUsers] = useState();
    const { searchTerm } = useParams();
    const [id, setId] = useState();

    useEffect(() => {
      const storedId = localStorage.getItem('user');
      if(storedId){
        const parsedId = JSON.parse(storedId);
        setId(parsedId.id)
      }
    },[])

    useEffect(() => {
        loadUsers();
    }, [searchTerm])

    const loadUsers = async () => {
        const users = await getAll(searchTerm);
        setUsers(users)
    }



    const handleToggleBlock = async (userId) => {
      const isBlock = await toggleBlock(userId);
      setUsers((oldUsers) =>
          oldUsers.map((user) =>
            user.id === userId ? { ...user, isBlock } : user
          )
        )
    };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Users"/>
        <Search 
        searchRoute="/admin/users/"
        defaultRoute="/admin/users"
        margin="1rem 0"
        placeholder="Search Users!"
        />
        <div className={classes.list_item}>
           <h3>Name</h3>
           <h3>Email</h3>
           <h3>Address</h3>
           <h3>Admin</h3>
           <h3>Actions</h3>
        </div>
        {
            users &&
            users.map(user => 
                <div key={user.id} className={classes.list_item}>
                   <span>{user.name}</span>
                   <span>{user.email}</span>
                   <span>{user.address}</span>
                   <span>{user.isAdmin ? '✅' : '❌'}</span>
                   <span className={classes.actions}>
                     <Link to={'/admin/editUser/' + user.id}>
                       Edit
                     </Link>
                     {id !== user.id && (
                       <Link onClick={() => handleToggleBlock(user.id)}>
                          {user.isBlock ? 'Unblock' : 'Block'}
                       </Link>
                     )}
                   </span>
                </div>
            )
        }
      </div>
    </div>
  )
}

export default UsersPage
