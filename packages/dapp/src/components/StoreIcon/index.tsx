import Image from 'next/image';

interface StoreIconProps {
  store: string;
}

const logo: Record<string, string> = {
  snap: 'masca_black.png',
  ceramic: 'ceramic_logo.png',
};

const StoreIcon = ({ store }: StoreIconProps) => (
  <div className="h-6 w-[26.5px]">
    <Image fill={true} src={`/images/${logo[store]}`} alt={store} />
  </div>
);

export default StoreIcon;
