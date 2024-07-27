import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import classes from "./FoodPage.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../Services/FoodService';
import StarRating from '../../Components/StarRating/StarRating';
import Tags from '../../Components/Tags/Tags';
import Price from '../../Components/Price/Price';
import { useCart } from '../../hooks/UseCart';
import Customize from '../../Components/Customize/Customize';
import NotFound from '../../Components/NotFound/NotFound';


const FoodPage = () => {
  const { addToCart,setToppings,setNames } = useCart();
  const [ food, setFood ] = useState({});
  const { id } = useParams();
  const myRef = useRef(null);
  const navigate = useNavigate();

  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleOpen = () => {
    setShowCustomize(true)
  };

  const removeToppingsForFood = () => {
    setToppings(prevToppings => {
      const updatedToppings = { ...prevToppings };
      delete updatedToppings[food.id];
      return updatedToppings;
    });
  };

  const removeToppingNames = () => {
    setNames((prevName)=> {
      const updatedNames = {...prevName};
      delete updatedNames[food.id];
      return updatedNames;
    });
  }
   

   const handleEvent = () =>{
    removeToppingsForFood()
    removeToppingNames()
    handleOpen()
   }
  

  useEffect(() => {
    const handleClickOutside = (e) =>{
      if(myRef.current && !myRef.current.contains(e.target)){
        setShowCustomize(false);
      }
    };
    const eventListener = document.addEventListener('mousedown', handleClickOutside );
    return () => {
      document.removeEventListener('mousedown', eventListener);
    };
  });


  const handleAddToCart = () => {
    addToCart(food);
    navigate('/cart');
  };

  useEffect(() => {
    getById(id).then(setFood);
  }, [id]);
 
  return (
    <>
     {!food ? (<NotFound message="Food Not Found!" linkText="Back To Homepage"/>) :
      (<div className={classes.container}>
         <img className={classes.image} 
          src={food.imageUrl}
          alt={food.name}
        />
        <div className={classes.details}>
           <div className={classes.header}>
               <span className={classes.name}>{food.name}</span>
               <span className={`${classes.favourite} ${food.favourite ? '' : classes.not}`}>
                 <FontAwesomeIcon icon={faHeart} />
               </span>
           </div>
           <div className={classes.rating}>
              <StarRating stars={food.stars} size={25}/>
           </div>
           <div className={classes.origins}>
              {food.origins?.map(origin => (
                 <span key={origin}>{origin}</span>))}
           </div>
           <div className={classes.tags}>
               {food.tags && (
                <Tags tags={food.tags.map(tag => ({name:tag}))} forFoodPage={true}/>
               )}
           </div>
           <div className={classes.cook_time}>
              <span>
                Time to cook about <strong>{food.cookTime}</strong> minutes
              </span>
           </div>
           <div className={classes.price}>
              <Price price={food.price}/>
              <div className={classes.button}>
                {food.tags?.includes("Veg-Pizza") || food.tags?.includes("Non-Veg-Pizza") || food.tags?.includes("Lunch") || food.tags?.includes("FastFood") ?
                <button className={classes.Customize} onClick={handleEvent}>Customize</button> : null}
                <div ref={myRef} className={classes.topping}>
                {showCustomize && 
                    <Customize  food={food} selectedToppings={selectedToppings} showCustomize={showCustomize} setSelectedToppings={setSelectedToppings} />
                }
                </div>
              </div>
            </div>
            <button className={classes.btn} onClick={() => handleAddToCart(food)}>Add To Cart</button>
        </div>
      </div>)} 
    </>
  );
};

export default FoodPage;
