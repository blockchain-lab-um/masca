import React from 'react';

const Button = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  return (
    <button className="btn-primary" onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default Button;
