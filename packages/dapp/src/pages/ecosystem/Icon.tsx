import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface IconProps {
  icon: string;
  href: string;
  alt: string;
  width: number;
  height: number;
}
const Icon = ({ icon, href, alt, width, height }: IconProps) => (
  <div className="relative flex items-center justify-center">
    <Link href={href}>
      <Image src={icon} alt={alt} width={width} height={height} />
    </Link>
  </div>
);

export default Icon;
