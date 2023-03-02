import React from 'react';
import Image, { StaticImageData } from 'next/image';

import ceramicLogo from '../../images/ceramic_logo.png';
import mascaLogo from '../../images/ssi_icon_b.png';

type StoreIconProps = {
  store: string;
};

const logo: Record<string, StaticImageData> = {
  snap: mascaLogo,
  ceramic: ceramicLogo,
};

const StoreIcon = ({ store }: StoreIconProps) => {
  return <Image src={logo[store]} alt={store} className="w-5 h-5 mx-0.5" />;
};

export default StoreIcon;
