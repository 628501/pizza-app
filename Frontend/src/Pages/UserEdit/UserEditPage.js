import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import classes from "./userEditPage.module.css";
import { getAllId, updateUser } from "../../Services/UserService";
import Title from "../../Components/Title/Title";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";

const UserEditPage = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const { userId } = useParams();
  const isEditMode = userId;

  useEffect(() => {
    if (isEditMode) loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const user = await getAllId(userId);
      reset(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const submit = async (userData) => {
    try {
      await updateUser(userData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? "Edit User" : "Add User"} />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div>
            <Input
              label="Name"
              {...register("name", { required: true, minLength: 3 })}
              error={errors.name}
            />
            <Input
              label="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[\w-]+@([\w-]+\.)+[\w-]{2,63}$/i,
                  message: "Email is not valid",
                },
              })}
              error={errors.email}
            />
            <Input
              label="Address"
              {...register("address", { required: true, minLength: 5 })}
              error={errors.address}
            />
            <Input
              label="Is Admin"
              type="checkbox"
              {...register("isAdmin")}
            />
            <Button type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
