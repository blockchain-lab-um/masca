import React from 'react';
import Image from 'next/image';

import { BASE_PATH } from '@/utils/constants';

type StoreIconProps = {
  store: string;
};

const logo: Record<string, string> = {
  snap: 'ssi_icon_b.png',
  ceramic: 'ceramic_logo.png',
};

const StoreIcon = ({ store }: StoreIconProps) => {
  return (
    <div className="w-5 h-5 mx-0.5">
      <Image
        fill={true}
        src={`${BASE_PATH}/images/${logo[store]}`}
        alt={store}
      />
    </div>
  );
};

export default StoreIcon;
