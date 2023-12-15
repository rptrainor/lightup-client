import type { Component, JSX } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: JSX.Element | string
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
