import React from "react";

import Style from "./Button.module.css";

const Button = ({btnName, handleClick, classStyle }) => (
  <button className={Style.button} onClick={handleClick}>{btnName}</button>
)

export default Button;
