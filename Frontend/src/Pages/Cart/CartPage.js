import React from "react";
import classes from "./CartPage.module.css";
import { useCart } from "../../hooks/UseCart";
import Title from "../../Components/Title/Title";
import { Link } from "react-router-dom";
import Price from "../../Components/Price/Price";
import NotFound from "../../Components/NotFound/NotFound";

const CartPage = () => {
  const { cart, removeFromCart, changeQuantity, names} = useCart();

  return (
    <>
      <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />
      {cart.items.length === 0 ? (<NotFound message="Cart Page Is Empty!"/>) : (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item, index) => (
              <li key={`${item.food.id}-${index}`}>
                <div>
                  <img
                    src={item.food.imageUrl}
                    alt={item.food.name}
                  />
                </div>
                <div>
                  <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                </div>
                <div>
                  <select
                    className={classes.select1}
                    value={item.quantity}
                    onChange={(e) =>
                      changeQuantity(item, Number(e.target.value))
                    }
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Price price={item.price} />
                </div>
                <div>
                  <button
                    className={classes.remove_button}
                    onClick={() => removeFromCart(item.food.id)}
                  >
                    Remove
                  </button>
                </div>
                {names[item.food.id] && 
                <div className={classes.name}>
                <strong>Selected Toppings</strong>{": "}
                {names[item.food.id] && item.toppings.join(", ")}
                </div>}
              </li>
            ))}
          </ul>
          <div className={classes.checkout}>
            <div>
              <div className={classes.food_count}>{cart.totalCount}</div>
              <div className={classes.total_price}>
                <Price price={cart.totalPrice} />
              </div>
            </div>
            <Link to="/checkout">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
