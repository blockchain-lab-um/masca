import React from 'react';

const ActiveButton = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  return (
    <h4
      className="text-opacity-0"
      onClick={() => {
        console.log('active btn');
      }}
    >
      {props.text}
    </h4>
  );
};

export default ActiveButton;
