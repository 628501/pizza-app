import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CartProvider from "./hooks/UseCart";
import "./axiosConfig";
import { AuthProvider } from "./hooks/UseAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadProvider } from "./hooks/Loading";
import "./Interceptors/AuthInterceptor";
import { OrderProvider } from "./hooks/OrderProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
                <App />
            </OrderProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="dark"
            />
          </CartProvider>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  </React.StrictMode>
);
