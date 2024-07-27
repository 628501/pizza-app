import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import classes from "./Search.module.css"
import { useNavigate, useParams } from 'react-router-dom'

const Search = ({ searchRoute, defaultRoute, margin, placeholder }) => {

  const [term, setTerm] = useState()
  const navigate = useNavigate()
  const { searchTerm } = useParams()

  useEffect(() => {
     setTerm(searchTerm ?? '');
  },[searchTerm])

  const search = async() => {
       term ? navigate(searchRoute + term) : navigate(defaultRoute)
  }
  
  return (
    <div className={classes.container} style={{ margin }}>
       <input type='text' placeholder={placeholder}
       onChange={e => setTerm(e.target.value)}
       onKeyUp={e => e.key === "Enter" && search()}
       value={term}
       />
       <button onClick={search}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
    </div>
  ) 
}

export default Search

Search.defaultProps = {
  searchRoute: '/search/', 
  defaultRoute: '/',
  placeholder: "Search Food Hunt"
}
