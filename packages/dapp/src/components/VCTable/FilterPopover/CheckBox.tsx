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
  <div className="dark:text-navy-blue-200 flex items-center font-medium text-gray-700">
    <input
      className="dark:accent-orange-accent-dark h-4 w-4 accent-pink-500"
      type="checkbox"
      checked={selected}
      onChange={() => {
        setSelected(!selected);
      }}
    />
    <span className="ml-2 max-w-[190px] truncate">{children}</span>
  </div>
);
