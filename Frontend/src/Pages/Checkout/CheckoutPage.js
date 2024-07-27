import React, { useEffect, useState } from 'react';
import { useCart } from '../../hooks/UseCart';
import classes from "./Checkoutpage.module.css";
import { useAuth } from '../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder, fetchOrder } from '../../Services/OrderService';
import Title from '../../Components/Title/Title';
import Input from '../../Components/Input/Input';
import Map from '../../Components/Map/Map';
import Button from '../../Components/Button/Button';
import OrderItemsList from '../../Components/OrderItemsList/OrderItemsList';
import { useAppContext } from '../../hooks/OrderProvider';

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user, address } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });
  const { selectedOrderId, setSelectedOrderId } = useAppContext(); 
  const [name, setName] = useState(user);
  const [addressState, setAddressState] = useState(address);

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
      setSelectedOrderId(null);
    }
  }, [selectedOrderId,setSelectedOrderId]);


  const fetchOrderDetails = async (orderId) => {
    try {
      const orderData = await fetchOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  useEffect(() => {
    if (cart.items) {
      const items = cart.items.map(item => ({
        food: {
          name: item.food.name,
          id: item.food.id,
          imageUrl: item.food.imageUrl,
          toppings: item.toppings,
          price: item.food.price
        },
        quantity: item.quantity,
        price: item.price,
      }));
      setOrder({ ...order, items, totalPrice: cart.totalPrice });
    }
  }, [cart]);



  const submit = async () => {
    try {
      if (!order.new_address) {
        toast.warning('Please select your location on the map');
        return;
      }
      const details = await createOrder({
        name: name,
        address: addressState,
        cart_items: order.items,
        total_price: order.totalPrice,
        addressLatLng: order.new_address,
      });
      toast.success('Order Saved Successfully');
      navigate(`/payment/${details}`);
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Order creation error:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Order Form" fontSize="1.6rem" />
        <div className={classes.inputs}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Address"
            value={addressState}
            onChange={(e) => setAddressState(e.target.value)}
          />
        </div>
        <OrderItemsList order={order} />
      </div>
      <div>
        <Title title="Choose Your Location" fontSize="1.6rem" />
        <Map
          location={order.new_address}
          onChange={(latlng) => {
            setOrder({ ...order, new_address: latlng });
          }}
        />
      </div>
      <div className={classes.buttons_container}>
        <div className={classes.buttons}>
          <Button
            type="submit"
            text="Go To Payment"
            width="100%"
            height="3rem"
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
