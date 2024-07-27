import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import FoodPage from './Pages/Food/FoodPage';
import CartPage from './Pages/Cart/CartPage';
import LoginPage from './Pages/Login/LoginPage';
import SignUp from './Pages/Login/SignUp';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import AuthRoute from './Components/AuthRoute/AuthRoute';
import PaymentPage from './Pages/Payment/PaymentPage';
import OrdersPage from './Pages/Orders/OrdersPage';
import ForgotPassword from './Components/Password/ForgotPassword';
import ResetPassword from './Components/Password/ResetPassword';
import Dashboard from './Components/Dashboard/Dashboard';
import AdminRoute from './Components/AdminRoutes/AdminRoute';
import FoodsAdminpage from './Pages/FoodsAdmin/FoodsAdminPage';
import FoodEditPage from './Pages/FoodEdit/FoodEditPage';
import UsersPage from './Pages/UsersPage/UsersPage';
import UserEditPage from './Pages/UserEdit/UserEditPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/search/:searchTerm' element={<HomePage />} />
      <Route path='/tag/:tag' element={<HomePage />} />
      <Route path='/food/:id' element={<FoodPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<SignUp />} />
      <Route
        path='/checkout'
        element={
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        }
      />
      <Route
        path='/payment/:orderId'
        element={
          <AuthRoute>
            <PaymentPage />
          </AuthRoute>
        }
      />
      <Route
        path='/orders'
        element={
          <AuthRoute>
            <OrdersPage />
          </AuthRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      />
      <Route
        path='/admin/foods/:searchTerm?'
        element={
          <AdminRoute>
            <FoodsAdminpage />
          </AdminRoute>
        }
      />
      <Route
        path='/admin/addFood'
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
      <Route
        path='/admin/editFood/:foodId'
        element={
          <AdminRoute>
            <FoodEditPage />
          </AdminRoute>
        }
      />
      <Route
        path='/admin/users/:searchTerm?'
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />
      <Route
        path='/admin/editUser/:userId'
        element={
          <AdminRoute>
            <UserEditPage />
          </AdminRoute>
        }
      />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:userId/:token' element={<ResetPassword />} />
    </Routes>
  );
}
