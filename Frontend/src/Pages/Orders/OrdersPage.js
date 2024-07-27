import React, { useEffect, useState } from 'react';
import classes from "./orderPage.module.css";
import { useAuth } from '../../hooks/UseAuth';
import { currentUser, DeleteOrder1, DeleteOrder2 } from '../../Services/OrderService';
import Title from '../../Components/Title/Title';
import DateTime from '../../Components/DateTime/DateTime';
import { Link, useNavigate } from 'react-router-dom';
import Price from '../../Components/Price/Price';
import Button from '../../Components/Button/Button';
import { useAppContext } from '../../hooks/OrderProvider';
import NotFound from '../../Components/NotFound/NotFound';

const OrdersPage = () => {
  const { email } = useAuth();
  const [orders, setOrders] = useState(null);
  const { setSelectedOrderId } = useAppContext(); 
  const navigate = useNavigate();

  useEffect(() => {
    const getNewOrder = async () => {
      try {
        const data = await currentUser(email);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getNewOrder();
  }, [email]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await DeleteOrder1(orderId);
      await DeleteOrder2(orderId);
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleOrderAgain = (orderId) => {
    setSelectedOrderId(orderId); 
    navigate('/checkout')
  };

  return (
    <div className={classes.container}>
      <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />
      {orders === null ? (<NotFound message="No Orders Found!"/>) : (
      <div>
      {orders && 
        orders.map(order => (
          <div key={order.id} className={classes.order_summary}>
            <div className={classes.header}>
              <span>{order.id}</span>
              <span>
                <DateTime date={order.created_at} />
              </span>
              <span className={classes.status}>
                {order.status}
              </span>
            </div>
            <div className={classes.delivery}>
              {order.name}, {order.address}
            </div>
            <div className={classes.items}>
              {order.items.map((item, index) => (
                <div key={index} className={classes.item}>
                  <Link to={`/food/${item.food.id}`}>
                    <img src={item.food.imageUrl} alt={item.food.name} />
                    
                  </Link>
                  <div className={classes.content}>
                  <p>
                    {item.food.name}
                    {item.food.toppings && item.food.toppings.length > 0 && (
                      <>
                        <br /><br /><strong>Added Toppings:</strong> {item.food.toppings.join(", ")}
                      </>
                    )}
                  </p>
                  <div>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.footer}>
              <div>
                  <Button text="Order Again" width="7rem" height="1.9rem" fontSize="1rem" backgroundColor="cadetblue" onClick={() => handleOrderAgain(order.id)} />
      
              </div>
              <div>
                <Button text="Cancel Order" width="7rem" height="1.9rem" fontSize="1rem" backgroundColor="#F23B2D" onClick={() => handleDeleteOrder(order.id)} />
              </div>
              <span className={classes.price}>
                <Price price={order.totalPrice} />
              </span>
            </div>
          </div>
        ))
      }
      </div>)}
    </div>
  );
};

export default OrdersPage;
