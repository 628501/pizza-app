import React from 'react';
import InputContainer from '../InputContainer/InputContainer';
import classes from "./Input.module.css"

const Input = (
    {label, type, value, defaultValue, onChange, onBlur, name, error},ref
) => {
     const getErrorMessage = () => {
        if(!error) return;
        if (error.message) return error.message;
        switch(error.type){
            case 'required':
                return 'This Field Is Required';
            case 'minLength':
                return 'Field Is Too Short';
            default:
                return '*';
        }
    }
  return (
    <div>
      <InputContainer label={label}>
        <input
        defaultValue={defaultValue}
        className={classes.input}
        type={type}
        value={value}
        placeholder={label}
        ref={ref}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        />
        {error && <div className={classes.error}>{getErrorMessage()}</div>}
      </InputContainer>
    </div>
  )
}

export default React.forwardRef(Input)
