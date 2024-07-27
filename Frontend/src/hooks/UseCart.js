import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const TOPPINGS_KEY = 'toppings'; 
const TOPPING_NAMES = 'names'
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0
};

const CartProvider = ({ children }) => {
  const initCart = getCartFromLocalStorage();
  const initToppings = getToppingsFromLocalStorage(); 
  const initNames = getToppingNamesFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);
  const [toppings, setToppings] = useState(initToppings); 
  const [names, setNames] = useState(initNames);
  

  const removeFromCart = (foodId) => {
    const filteredCartItems = cartItems.filter((item) => item.food.id !== foodId);
    setCartItems(filteredCartItems)
    setToppings((prevToppings) => {
      const updatedToppings = { ...prevToppings };
      delete updatedToppings[foodId];
      return updatedToppings;
    });
    setNames((prevName)=> {
      const updatedNames = {...prevName};
      delete updatedNames[foodId];
      return updatedNames;
    });
   }
  

  useEffect(() => {
    const totalPrice = sum(cartItems.map((item) => item.price));
    const totalCount = sum(cartItems.map((item) => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);

    const cartData = {
      items: cartItems,
      totalPrice,
      totalCount
    };

    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    localStorage.setItem(TOPPINGS_KEY, JSON.stringify(toppings)); 
    localStorage.setItem(TOPPING_NAMES,JSON.stringify(names))
  }, [cartItems,toppings,names]); 

  function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }

  function getToppingsFromLocalStorage() {
    const storedToppings = localStorage.getItem(TOPPINGS_KEY);
    return storedToppings ? JSON.parse(storedToppings) : {};
  }

  function getToppingNamesFromLocalStorage(){
    const storedNames = localStorage.getItem(TOPPING_NAMES);
    return storedNames ? JSON.parse(storedNames) : {};
  }

  const veg = (food, value) => {
    if (food) {
      setToppings((prevToppings) => ({
        ...prevToppings,
        [food.id]: prevToppings[food.id] ? prevToppings[food.id] + Number(value) : Number(value)
      }));
    }
  }; 


  const toppingName = (food, tName) =>{
    const curtop = names[food.id] || []
      if(food) {
        setNames((prevName) => ({
          ...prevName,
          [food.id] : [...curtop,tName] 
        }))
      }
  }

  const sum = (item) => {
    return item.reduce((prevValue, curValue) => prevValue + curValue, 0);
  };

  const changeQuantity = (cartItem, newQuantity) => {
    const { food } = cartItem;
    const price = toppings[food.id]
      ? food.price + (toppings[food.id] * newQuantity)
      : food.price * newQuantity;

    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: price
    };

    setCartItems(cartItems.map((item) => (item.food.id === food.id ? changedCartItem : item)));
  };

  const addToCart = (food) => {
    const totalPriceWithToppings = calculatePrice(food, toppings);

    const price = toppings[food.id] ? totalPriceWithToppings : food.price;

    const existingCartItemIndex = cartItems.findIndex(item => item.food.id === food.id);

    if (existingCartItemIndex !== -1) {
      const updatedCartItem = {
        ...cartItems[existingCartItemIndex],
        toppings: names[food.id],
        price
      };

      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex] = updatedCartItem;

      setCartItems(updatedCartItems);
    } else {
        setCartItems([...cartItems, { food, quantity: 1, toppings: names[food.id], price }]);
     }
   };
  

  
  const calculatePrice = (food, toppings) => {
    let price = food.price;
    if (toppings) {
        price += toppings[food.id]
    }
  
    return price;
  }

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(TOPPINGS_KEY);
    localStorage.removeItem(TOPPING_NAMES);
    const { items, totalPrice, totalCount } = EMPTY_CART;
    setCartItems(items);
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
    setToppings({});
    setNames({});
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        veg,
        setToppings,
        toppingName,
        setNames,
        names,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export default CartProvider;

export const useCart = () => useContext(CartContext);


   
