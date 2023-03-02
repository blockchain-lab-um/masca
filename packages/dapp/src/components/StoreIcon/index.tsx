import React from 'react';
import Image, { StaticImageData } from 'next/image';
import ceramicLogo from '@/public/images/ceramic_logo.png';
import mascaLogo from '@/public/images/ssi_icon_b.png';

type StoreIconProps = {
  store: string;
};

const logo: Record<string, string> = {
  snap: '/images/ssi_icon_b.png',
  ceramic: '/images/ceramic_logo.png',
};

const StoreIcon = ({ store }: StoreIconProps) => {
  return <Image src={logo[store]} alt={store} className="w-5 h-5 mx-0.5" />;
};

export default StoreIcon;
