import React, { useState, useEffect } from "react";
import classes from "./SignUp.module.css";
import { useForm } from "react-hook-form";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import Title from "../../Components/Title/Title";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faEyeSlash,
  faEnvelope,
  faAddressCard,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { register: signup, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (user) returnUrl ? navigate(returnUrl) : navigate("/");
  }, [navigate, returnUrl, user]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password, data.address, data.admin);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Register" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="text"
              label="Name"
              {...register("name", { required: true, minLength: 5 })}
              error={errors.name}
            />
            <FontAwesomeIcon icon={faUser} className={classes.icon1} />
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                  message: "Email is not valid",
                },
              })}
              error={errors.email}
            />
            <FontAwesomeIcon icon={faEnvelope} className={classes.icon2} />
          </div>
          <div>
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              {...register("password", { required: true, minLength: 5 })}
              error={errors.password}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className={classes.icon3}
              onClick={togglePasswordVisibility}
            />
          </div>
          <div>
            <Input
              type="text"
              label="Address"
              {...register("address", { required: true, minLength: 5 })}
              error={errors.address}
            />
            <FontAwesomeIcon icon={faAddressCard} className={classes.icon4} />
          </div>
          <div>
            <Input
               type="text"
               label="Admin"
               {...register("admin", {
                 required: true,
                 pattern: {
                   value: /^(true|false)$/i,
                   message: "Admin must be 'true' or 'false'.",
                 },
               })}
               error={errors.admin}
             />
            <FontAwesomeIcon icon={faLock} className={classes.icon5} />
          </div>
          <Button type="submit" text="Register" />
          <div className={classes.register}>
            <p>
              Already have an account? &nbsp; <Link to="/login">login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
