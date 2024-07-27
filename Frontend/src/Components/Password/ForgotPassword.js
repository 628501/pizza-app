import React from "react";
import classes from "./ForgotPassword.module.css";
import Input from "../Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Title from "../Title/Title";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/UseAuth";

const ForgotPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { forgotPassword } = useAuth();

  const submit = async (data) => {
    try {
      await forgotPassword(data.email);
    } catch (error) {
      console.error("Failed to send mail:", error);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Forgot Password" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div>
            <Input
              type="email"
              label="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[\w-]+@([\w-]+\.)+[\w-]{2,63}$/i,
                  message: "Email Is Not Valid",
                },
              })}
              error={errors.email}
              autocomplete="email"
            />
            <FontAwesomeIcon icon={faEnvelope} className={classes.icon1} />
          </div>
          <Button type="submit" text="Send" />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
