import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { newOrder } from '../../Services/OrderService';
import React, { useEffect, useState } from 'react';
import { useCart } from '../../hooks/UseCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../hooks/Loading';

const PaypalButton = ({ order }) => {

  return (
    <PayPalScriptProvider
      options={{
        clientId: 'AermEgBAhYi06j-B5SMfLFVB8CBHjNCFhd03xi7c5bFQT0r6zmRptAxm-F7E9cXtEiObrChmRzOhjs5z'
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;

function Buttons({ order }) {
  const { clearCart } = useCart();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = Loading();

  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  }, [isPending, showLoading, hideLoading]);

  useEffect(() => {
    const storedContext = localStorage.getItem('user');
    if(storedContext){
      const parsedId = JSON.parse(storedContext);
      setEmail(parsedId.emailId);
    }
  },[]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: order.totalPrice,
        },
      }],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      console.log();
        await newOrder({
        name: order.name,
        address: order.address,
        emailId: email,
        cart_items: order.items,
        total_price: order.totalPrice,
        paymentId: payment.id,
        status: 'PAID',
        addressLatLng: order.new_address,
      });
      clearCart();
      toast.success('Payment Saved Successfully', 'Success');
      navigate('/');
    } catch (error) {
      toast.error('Payment Saved Failed', 'Error');
    }
  };

  const onError = (err) => {
    toast.error('Payment Failed', 'Error');
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}
