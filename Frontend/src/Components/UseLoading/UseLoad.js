import React from "react";
import { Loading } from "../../hooks/Loading";
import classes from "./useLoad.module.css";

const UseLoad = () => {
  const { isLoading } = Loading();
  if (!isLoading) return;
  return (
    <div className={classes.container}>
      <div className={classes.loader}>
        <div className={classes.items}>
          <img className={classes.img} src="/pizza.png" alt="pizzaLoader" />
          <img className={classes.img2} src="/pie.png" alt="pie" />
        </div>
      </div>
    </div>
  );
};

export default UseLoad;
