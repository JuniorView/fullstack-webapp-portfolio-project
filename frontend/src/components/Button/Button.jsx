import "./Button.css";

function Button(props) {
  return (
    <button type="submit" className="custom-button" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Button;
