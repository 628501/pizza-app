import classes from "./Button.module.css";


const Button = ({
    type,
    text,
    onClick,
    color,
    backgroundColor,
    fontSize,
    width,
    height,
    padding
}) => {
  return (
    <div className={classes.container}>
       <button 
        style={{
            color,
            backgroundColor,
            fontSize,
            width,
            height,
            padding
        }}
        type={type}
        onClick={onClick}
       >
       {text}
       </button>
    </div>
  )
}

export default Button

Button.defaultProps = {
    type: 'button',
    text: 'Submit',
    backgroundColor: 'green',
    color: 'white',
    fontSize: '1.3rem',
    width: '12rem',
    height: '3.5rem',
}