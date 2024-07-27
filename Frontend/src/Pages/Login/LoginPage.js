import React, { useEffect, useState } from 'react';
import classes from "./loginPage.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import Title from '../../Components/Title/Title';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();


    const { login, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const returnUrl = params.get('returnUrl');

    useEffect(()=>{
        if(user)
            returnUrl ? navigate(returnUrl) : navigate('/')

    },[user,returnUrl,navigate])

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const submit = async (data) => {
      try {
          await login(data.email, data.password);
      } catch (error) {
          console.error('Login failed:', error);
      }
  };

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <Title title="Login" />
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <div>
                        <Input
                            type="email"
                            label="Email"
                            {...register('email', {
                                required: true,
                                pattern: {
                                    value: /^[\w-]+@([\w-]+\.)+[\w-]{2,63}$/i, 
                                    message: 'Email Is Not Valid'
                                },
                            })}
                            error={errors.email}
                            autocomplete="email"
                        />
                        <FontAwesomeIcon icon={faEnvelope} className={classes.icon1} />
                    </div>
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
                            className={classes.icon2} 
                            onClick={togglePasswordVisibility} 
                        />
                    </div>
                    <div className={classes.remember}>
                        <label><input type='checkbox' />Remember me</label>
                        <Link to="/forgot-password" className={classes.forgot}>Forgot Password</Link>
                    </div>
                    <Button type='submit' text='Login' />
                    <div className={classes.register}>
                        <p>Don't have an account? &nbsp; <Link to="/register">register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
