import React,{ useEffect, useReducer } from 'react'
import { getAll, getAllByTags, getAllTags, search } from '../../Services/FoodService'
import Thumbnails from '../../Components/Thumbnails/Thumbnails'
import { useParams } from 'react-router-dom'
import Search from '../../Components/Search/Search'
import Tags from '../../Components/Tags/Tags'
import NotFound from '../../Components/NotFound/NotFound'

const initialState = { foods : [], tags : [] }

const reducer = (state,action) => {
    switch(action.type){
        case 'FOODS_LOADED':
            return{
                ...state,
                foods : action.payload
            }
        case 'TAGS_LOADED':
          return{
            ...state,
            tags: action.payload
          }
        default:
            return state
    }
}

const HomePage = () => {
   
    const [state,dispatch] = useReducer(reducer,initialState)
    const { foods, tags } = state;
    const { searchTerm, tag, id } = useParams()

    useEffect(() => {
        getAllTags()
        .then(tags => dispatch({type:'TAGS_LOADED',payload:tags}))
        .catch((error) => {
          console.error('Error loading Tags:', error);
        })
        
        const loadFoods = tag 
        ? getAllByTags(tag) 
        : searchTerm 
        ? search(searchTerm) 
        : getAll()  

        loadFoods
        .then((foods) => {
          dispatch({ type: 'FOODS_LOADED', payload: foods });
        })
        .catch((error) => {
          console.error('Error loading foods:', error);
        })
       

    },[searchTerm,tag,id])
   


  return (
    <div>
      <Search/>
      <Tags tags={tags}/>
      {foods.length === 0 && <NotFound linkText="Reset Page"/>}
      <Thumbnails foods={foods}/> 
    </div>
  )
}

export default HomePage
