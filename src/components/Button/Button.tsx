import React from "react"

import classes from "./Button.module.scss"

type Props = {
  children: string
  iconLeft?: string
  iconRight?: string
  [x: string]: any
}

const Button: React.FC<Props> = ({ iconLeft, iconRight, children, ...restProps }) => {
  return (
    <button className={classes.btn} {...restProps}>
      {iconLeft && <img src={iconLeft} alt="Left icon" className={classes.iconLeft} />}
      {children}
      {iconRight && <img src={iconRight} alt="Left icon" className={classes.iconRight} />}
    </button>
  )
}

export default Button