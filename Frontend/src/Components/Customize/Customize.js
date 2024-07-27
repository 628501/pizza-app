import React, { useEffect, useState } from "react";
import classes from "./Customize.module.css";
import { useCart } from "../../hooks/UseCart";
import { getBase, getToppings } from "../../Services/FoodService";

const Customize = ({ food, selectedToppings, setSelectedToppings, showCustomize }) => {
  const { veg, toppingName } = useCart();
  const [toppings, setToppings] = useState([]);
  const [base, setBase] = useState([]);

  useEffect(() => {
    const fetchBase = async () => {
      try {
        const baseData = await getBase();
        setBase(baseData);
      } catch (error) {
        console.error("Error fetching base:", error);
      }
    };

    fetchBase();
  }, []);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const toppingData = await getToppings();
        setToppings(toppingData);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchToppings();
  }, []);

  const handleToppingClick = (toppingPrice, topping) => {
    if (!selectedToppings.includes(toppingPrice)) {
      setSelectedToppings([...selectedToppings, toppingPrice]);
      toppingName(food, topping); 
      veg(food, toppingPrice); 
    } else {
      setSelectedToppings(selectedToppings.filter((item) => item !== toppingPrice));
    }
  };

  const isToppingSelected = (toppingPrice) =>
    selectedToppings && selectedToppings.includes(toppingPrice);

  return (
    <div className={`${showCustomize === false ? classes.back : classes.main}`}>
      <div className={classes.bases}>
        <div className={classes.label}>
          <label>
            <img className={classes.pimg} src="/base.jpg" alt="base" />
          </label>
        </div>
        <div className={classes.container}>
          {base.map((item) => (
            <button
              className={classes.btn}
              key={item.id}
              value={Number(item.price)}
              onClick={() => handleToppingClick(Number(item.price), item.base)}
              disabled={isToppingSelected(Number(item.price))}
            >
              {item.base} - ₹{item.price}
            </button>
          ))}
        </div>
      </div>
      <div className={classes.veg}>
        <div className={classes.label}>
          <label>
            <img className={classes.pimg} src="/veg.png" alt="veg" />
          </label>
        </div>
        <div>
          {toppings.Veg && toppings.Veg.map((item) => (
            <button
              className={classes.btn}
              key={item.id}
              value={Number(item.price)}
              onClick={() => handleToppingClick(Number(item.price), item.topping)}
              disabled={isToppingSelected(Number(item.price))}
            >
              {item.topping} - ₹{item.price}
            </button>
          ))}
        </div>
        <div className={classes.label}>
          <label>
            <img className={classes.pimg} src="/meat.jpg" alt="meat" />
          </label>
        </div>
        <div>
          {toppings.NonVeg && toppings.NonVeg.map((item) => (
            <button
              className={classes.btn}
              key={item.id}
              value={Number(item.price)}
              onClick={() => handleToppingClick(Number(item.price), item.topping)}
              disabled={isToppingSelected(Number(item.price))}
            >
              {item.topping} - ₹{item.price}
            </button>
          ))}
        </div>
        <div className={classes.label}>
          <label>
            <img className={classes.pimg} src="/cheese.png" alt="cheese" />
          </label>
        </div>
        <div>
          {toppings.Cheese && toppings.Cheese.map((item) => (
            <button
              className={classes.btn}
              key={item.id}
              value={Number(item.price)}
              onClick={() => handleToppingClick(Number(item.price), item.topping)}
              disabled={isToppingSelected(Number(item.price))}
            >
              {item.topping} - ₹{item.price}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customize;
