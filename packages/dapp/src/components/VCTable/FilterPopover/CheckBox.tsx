import React from 'react';

interface CheckBoxProps {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  children: React.ReactNode;
}

export const CheckBox = ({
  selected,
  setSelected,
  children,
}: CheckBoxProps) => (
  // Create checkbox
  <div>
    <input
      type="checkbox"
      checked={selected}
      onChange={() => {
        setSelected(!selected);
      }}
    />
    {children}
  </div>
);
