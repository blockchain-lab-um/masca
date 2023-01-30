import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => {
  return (
    <div className="text-h5 sm:text-h4 lg:text-h3 font-ubuntu text-black font-bold text-opacity-0 bg-clip-text bg-gradient-to-b to-pink-500 from-orange-500 ">
      {children}
    </div>
  );
};
