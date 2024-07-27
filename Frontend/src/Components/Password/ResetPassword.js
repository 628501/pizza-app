import React, { useState } from "react";
import classes from "./ForgotPassword.module.css";
import Input from "../Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Title from "../Title/Title";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/UseAuth";

const ResetPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { ResetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
};

  const submit = async (data) => {
    try {
      await ResetPassword(data.password);
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Failed to send mail:", error);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Reset Password" />
        <form onSubmit={handleSubmit(submit)} noValidate>
        <div>
            <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                {...register('password', { required: true, minLength: 5 })}
                error={errors.password}
                autocomplete="current-password"
            />
            <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                className={classes.icon1} 
                onClick={togglePasswordVisibility} 
            />
        </div>
          <Button type="submit" text="Update" />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
