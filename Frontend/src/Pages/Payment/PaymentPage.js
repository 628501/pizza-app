import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './PaymentPage.module.css';
import { fetchOrder } from '../../Services/OrderService';
import Title from '../../Components/Title/Title';
import OrderItemsList from '../../Components/OrderItemsList/OrderItemsList';
import Map from '../../Components/Map/Map';
import PaypalButton from '../../Components/PayPalButton/PaypalButton';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await fetchOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    getOrder();
  }, [orderId]);

  if (!order) return null;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Order Summary" fontSize="1.6rem" />
        <div className={classes.summary}>
          <div>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <OrderItemsList order={order} />
      </div>
      <div className={classes.map}>
          <Title title="Your Location" fontSize="1.6rem" />
          <Map readOnly={true} location={order.new_address} />
      </div>
      <div className={classes.buttons_container}>
           <div className={classes.buttons}>
              <PaypalButton order={order} />
           </div>
      </div>
    </div>
  );
};

export default PaymentPage;
