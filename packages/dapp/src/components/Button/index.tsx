import React from 'react';

const Button = ({ type = 'btn-primary', onClick, text }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  return (
    <button className={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
