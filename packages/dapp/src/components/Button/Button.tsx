import React from 'react';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  id?: string;
};

const Button = ({
  className = 'btn-primary',
  id,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button className={className} onClick={onClick} id={id}>
      {children}
    </button>
  );
};

export default Button;
