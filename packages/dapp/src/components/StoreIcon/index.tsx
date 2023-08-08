import Image from 'next/image';

type StoreIconProps = {
  store: string;
};

const logo: Record<string, string> = {
  snap: 'masca_black.png',
  ceramic: 'ceramic_logo.png',
};

const StoreIcon = ({ store }: StoreIconProps) => (
  <div className="h-6 w-7">
    <Image fill={true} src={`/images/${logo[store]}`} alt={store} />
  </div>
);

export default StoreIcon;
