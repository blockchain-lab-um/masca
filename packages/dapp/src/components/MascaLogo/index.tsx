import Image from 'next/image';

const MascaLogo = () => (
  <div className="relative h-[24px] w-[28px] sm:h-[36px] sm:w-[40px] lg:h-[46px] lg:w-[50px] xl:h-[48px] xl:w-[54px]">
    <Image
      className="dark:hidden"
      src={'/images/masca_black.png'}
      alt="Masca Logo"
      fill={true}
    />
    <Image
      className="hidden dark:block"
      src={'/images/masca_white.png'}
      alt="Masca Logo"
      fill={true}
    />
  </div>
);

export default MascaLogo;
