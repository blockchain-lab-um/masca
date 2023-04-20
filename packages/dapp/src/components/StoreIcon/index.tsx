import React from 'react';
import Image from 'next/image';

type StoreIconProps = {
  store: string;
};

const logo: Record<string, string> = {
  snap: 'ssi_icon_b.png',
  ceramic: 'ceramic_logo.png',
};

const StoreIcon = ({ store }: StoreIconProps) => {
  return (
    <div className="mx-0.5 h-5 w-5">
      <Image fill={true} src={`/images/${logo[store]}`} alt={store} />
    </div>
  );
};

export default StoreIcon;
